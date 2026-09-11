<?php

namespace App\Imports;

use App\Models\RiskRegister;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;

class RiskRegisterImport implements ToCollection, WithCalculatedFormulas
{
    public function collection(Collection $rows)
    {
        // Truncate existing data to cleanly load newly uploaded file
        RiskRegister::truncate();

        $rawRows = $rows->toArray();
        if (empty($rawRows)) {
            return;
        }

        // 1. Locate main header row index (within first 20 rows)
        $headerRowIdx = -1;
        foreach (array_slice($rawRows, 0, 20, true) as $idx => $row) {
            if (!is_array($row)) continue;
            foreach ($row as $cell) {
                $c = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$cell));
                if (
                    str_contains($c, 'kode') ||
                    str_contains($c, 'deskripsi') ||
                    str_contains($c, 'kejadian') ||
                    str_contains($c, 'peristiwa') ||
                    str_contains($c, 'probabilitas') ||
                    str_contains($c, 'dampak')
                ) {
                    $headerRowIdx = $idx;
                    break 2;
                }
            }
        }

        if ($headerRowIdx === -1) {
            $headerRowIdx = 0;
        }

        $hRow1 = $rawRows[$headerRowIdx] ?? [];
        $hRow2 = $rawRows[$headerRowIdx + 1] ?? [];
        $maxCols = max(count($hRow1), count($hRow2));

        $kodeColIdx = -1;
        $noColIdx = -1;
        $deskColIdx = -1;
        $akarColIdx = -1;
        $strategiColIdx = -1;
        $probInhColIdx = -1;
        $dampInhColIdx = -1;
        $bobotInhColIdx = -1;
        $peringkatInhColIdx = -1;
        $probResColIdx = -1;
        $dampResColIdx = -1;
        $peringkatResColIdx = -1;

        // Scan columns dynamically by scanning header text
        for ($c = 0; $c < $maxCols; $c++) {
            $cell1 = strtolower(trim((string)($hRow1[$c] ?? '')));
            $cell2 = strtolower(trim((string)($hRow2[$c] ?? '')));
            $fullText = preg_replace('/[^a-zA-Z0-9]/', '', $cell1 . ' ' . $cell2);

            $isRes = str_contains($fullText, 'residual') || str_contains($fullText, 'res');

            if (str_contains($fullText, 'kode')) {
                $kodeColIdx = $c;
            } elseif (str_contains($fullText, 'no') || str_contains($fullText, 'nomor')) {
                if ($noColIdx === -1) $noColIdx = $c;
            } elseif (
                str_contains($fullText, 'deskripsi') ||
                str_contains($fullText, 'kejadian') ||
                str_contains($fullText, 'peristiwa') ||
                str_contains($fullText, 'namarisiko') ||
                str_contains($fullText, 'description') ||
                str_contains($fullText, 'event')
            ) {
                $deskColIdx = $c;
            } elseif (
                str_contains($fullText, 'akar') ||
                str_contains($fullText, 'penyebab') ||
                str_contains($fullText, 'rootcause')
            ) {
                $akarColIdx = $c;
            } elseif (
                str_contains($fullText, 'strategi') ||
                str_contains($fullText, 'mitigasi') ||
                str_contains($fullText, 'response')
            ) {
                $strategiColIdx = $c;
            } elseif (
                str_contains($fullText, 'bobot') ||
                str_contains($fullText, 'weight') ||
                str_contains($fullText, 'score')
            ) {
                if ($bobotInhColIdx === -1) $bobotInhColIdx = $c;
            } elseif ($isRes) {
                if (
                    str_contains($fullText, 'prob') ||
                    str_contains($fullText, 'pinherent') ||
                    str_contains($fullText, 'presidual') ||
                    $fullText === 'p'
                ) {
                    $probResColIdx = $c;
                } elseif (
                    str_contains($fullText, 'dampak') ||
                    str_contains($fullText, 'iresidual') ||
                    str_contains($fullText, 'impact') ||
                    $fullText === 'i'
                ) {
                    $dampResColIdx = $c;
                } elseif (
                    str_contains($fullText, 'peringkat') ||
                    str_contains($fullText, 'level') ||
                    str_contains($fullText, 'risk')
                ) {
                    $peringkatResColIdx = $c;
                }
            } else {
                if (
                    str_contains($fullText, 'probabilitas') ||
                    str_contains($fullText, 'pinherent') ||
                    (str_contains($fullText, 'prob') && !str_contains($fullText, 'peringkat')) ||
                    $fullText === 'p'
                ) {
                    if ($probInhColIdx === -1) $probInhColIdx = $c;
                    elseif ($probResColIdx === -1) $probResColIdx = $c;
                } elseif (
                    str_contains($fullText, 'dampak') ||
                    str_contains($fullText, 'iinherent') ||
                    (str_contains($fullText, 'impact') && !str_contains($fullText, 'peringkat')) ||
                    $fullText === 'i'
                ) {
                    if ($dampInhColIdx === -1) $dampInhColIdx = $c;
                    elseif ($dampResColIdx === -1) $dampResColIdx = $c;
                } elseif (str_contains($fullText, 'peringkat')) {
                    if ($peringkatInhColIdx === -1) $peringkatInhColIdx = $c;
                    elseif ($peringkatResColIdx === -1) $peringkatResColIdx = $c;
                }
            }
        }

        // Fallback for standard Pertamina Risk Register Excel layout (K=10, M=12, AA=26, AB=27)
        if ($probInhColIdx === -1 && $maxCols > 10) $probInhColIdx = 10;
        if ($dampInhColIdx === -1 && $maxCols > 12) $dampInhColIdx = 12;
        if ($probResColIdx === -1 && $maxCols > 26) $probResColIdx = 26;
        if ($dampResColIdx === -1 && $maxCols > 27) $dampResColIdx = 27;

        // Determine start row of data
        $dataStartRow = $headerRowIdx + 1;
        $rowAfterHeader = $rawRows[$headerRowIdx + 1] ?? [];
        if (is_array($rowAfterHeader)) {
            $isSubHeader = false;
            foreach ($rowAfterHeader as $cell) {
                $val = strtolower(trim((string)$cell));
                if (in_array($val, ['p', 'i', 'w', 'prob', 'dampak', 'probabilitas', 'inherent', 'residual'])) {
                    $isSubHeader = true;
                    break;
                }
            }
            if ($isSubHeader) {
                $dataStartRow = $headerRowIdx + 2;
            }
        }

        $rowCount = count($rawRows);
        $inserted = 0;

        for ($r = $dataStartRow; $r < $rowCount; $r++) {
            $row = $rawRows[$r];
            if (!is_array($row)) continue;

            $rawDesk = $deskColIdx !== -1 ? trim((string)($row[$deskColIdx] ?? '')) : '';
            $rawKode = $kodeColIdx !== -1 ? trim((string)($row[$kodeColIdx] ?? '')) : '';
            $rawNo = $noColIdx !== -1 ? ($row[$noColIdx] ?? null) : null;

            // Strict filter: Skip empty or header-repeat rows
            if (!$rawDesk && !$rawKode && ($rawNo === null || $rawNo === '' || !is_numeric($rawNo))) {
                continue;
            }

            $lowerDesk = strtolower($rawDesk);
            if (
                str_starts_with($lowerDesk, 'catatan') ||
                str_starts_with($lowerDesk, 'disetujui') ||
                str_starts_with($lowerDesk, 'total') ||
                str_starts_with($lowerDesk, 'laporan')
            ) {
                continue;
            }

            $no = ($rawNo !== null && is_numeric($rawNo)) ? (int)$rawNo : ($inserted + 1);
            $kode = $rawKode ?: sprintf('LHD-OPS-260%03d', $no);
            $deskripsi = $rawDesk ?: sprintf('Kejadian Risiko Operasional #%d', $no);
            $akar = ($akarColIdx !== -1 && !empty($row[$akarColIdx])) ? trim((string)$row[$akarColIdx]) : '-';

            $probInherent = $probInhColIdx !== -1 ? $this->extractFirstDigit($row[$probInhColIdx] ?? null) : null;
            $dampakInherent = $dampInhColIdx !== -1 ? $this->extractFirstDigit($row[$dampInhColIdx] ?? null) : null;
            $pInhText = $peringkatInhColIdx !== -1 ? trim((string)($row[$peringkatInhColIdx] ?? '')) : '';

            if (!$probInherent || !$dampakInherent) {
                $parsed = $this->parseLevelFromText($pInhText);
                $probInherent = $probInherent ?: $parsed['prob'];
                $dampakInherent = $dampakInherent ?: $parsed['dampak'];
            }

            $bobotInherent = ($bobotInhColIdx !== -1 && is_numeric($row[$bobotInhColIdx] ?? null))
                ? (int)$row[$bobotInhColIdx]
                : ($probInherent * $dampakInherent);

            $peringkatInherent = $pInhText ?: $this->getRiskLevelLabel($probInherent, $dampakInherent);
            $strategi = ($strategiColIdx !== -1 && !empty($row[$strategiColIdx])) ? trim((string)$row[$strategiColIdx]) : 'MITIGATE';

            $probResidual = $probResColIdx !== -1 ? $this->extractFirstDigit($row[$probResColIdx] ?? null) : null;
            $dampakResidual = $dampResColIdx !== -1 ? $this->extractFirstDigit($row[$dampResColIdx] ?? null) : null;
            $pResText = $peringkatResColIdx !== -1 ? trim((string)($row[$peringkatResColIdx] ?? '')) : '';

            if (!$probResidual || !$dampakResidual) {
                $derived = $this->deriveResidualPI($pResText, $probInherent, $dampakInherent);
                $probResidual = $probResidual ?: $derived['prob'];
                $dampakResidual = $dampakResidual ?: $derived['dampak'];
            }

            $peringkatResidual = $pResText ?: $this->getRiskLevelLabel($probResidual, $dampakResidual);

            RiskRegister::create([
                'no' => $no,
                'kode' => $kode,
                'deskripsi' => $deskripsi,
                'akar' => $akar,
                'probInherent' => $probInherent,
                'dampakInherent' => $dampakInherent,
                'bobotInherent' => $bobotInherent,
                'peringkatInherent' => $peringkatInherent,
                'strategi' => $strategi,
                'probResidual' => $probResidual,
                'dampakResidual' => $dampakResidual,
                'peringkatResidual' => $peringkatResidual,
            ]);

            $inserted++;
        }
    }

    private function extractFirstDigit($val): ?int
    {
        if ($val === null || $val === '') return null;
        $str = trim((string)$val);
        if (is_numeric($str)) {
            $num = (int)$str;
            if ($num >= 1 && $num <= 5) return $num;
        }
        if (preg_match('/[1-5]/', $str, $matches)) {
            return (int)$matches[0];
        }
        return null;
    }

    private function parseLevelFromText(?string $text): array
    {
        $t = strtoupper(trim((string)$text));
        if (str_contains($t, 'HIGH RISK') && !str_contains($t, 'MODERATE TO HIGH')) {
            return ['prob' => 4, 'dampak' => 4];
        }
        if (str_contains($t, 'MODERATE TO HIGH') || str_contains($t, 'MODERATE-TO-HIGH')) {
            return ['prob' => 3, 'dampak' => 4];
        }
        if (str_contains($t, 'MODERATE RISK') || $t === 'MODERATE') {
            return ['prob' => 2, 'dampak' => 3];
        }
        if (str_contains($t, 'LOW TO MODERATE') || str_contains($t, 'LOW-TO-MODERATE')) {
            return ['prob' => 2, 'dampak' => 2];
        }
        return ['prob' => 1, 'dampak' => 2];
    }

    private function deriveResidualPI(?string $resText, int $pInh, int $dInh): array
    {
        $resUpper = strtoupper(trim((string)$resText));
        if (str_contains($resUpper, 'LOW RISK') && !str_contains($resUpper, 'MODERATE')) {
            return ['prob' => 1, 'dampak' => min($dInh, 2)];
        }
        if (str_contains($resUpper, 'LOW TO MODERATE') || str_contains($resUpper, 'LOW-TO-MODERATE')) {
            return ['prob' => 2, 'dampak' => 2];
        }
        if (str_contains($resUpper, 'MODERATE TO HIGH') || str_contains($resUpper, 'MODERATE-TO-HIGH')) {
            return ['prob' => max(2, $pInh - 1), 'dampak' => max(3, $dInh)];
        }
        if (str_contains($resUpper, 'MODERATE RISK') || $resUpper === 'MODERATE') {
            return ['prob' => max(1, $pInh - 1), 'dampak' => max(2, $dInh - 1)];
        }
        if (str_contains($resUpper, 'HIGH RISK') || $resUpper === 'HIGH') {
            return ['prob' => $pInh, 'dampak' => $dInh];
        }
        return ['prob' => max(1, $pInh - 1), 'dampak' => max(1, $dInh - 1)];
    }

    private function getRiskLevelLabel(int $prob, int $dampak): string
    {
        $matrix = [
            '1-1' => 'LOW RISK', '1-2' => 'LOW RISK', '1-3' => 'LOW RISK', '1-4' => 'LOW TO MODERATE RISK', '1-5' => 'MODERATE RISK',
            '2-1' => 'LOW RISK', '2-2' => 'LOW TO MODERATE RISK', '2-3' => 'MODERATE RISK', '2-4' => 'MODERATE RISK', '2-5' => 'MODERATE TO HIGH RISK',
            '3-1' => 'LOW RISK', '3-2' => 'MODERATE RISK', '3-3' => 'MODERATE RISK', '3-4' => 'MODERATE TO HIGH RISK', '3-5' => 'HIGH RISK',
            '4-1' => 'LOW TO MODERATE RISK', '4-2' => 'MODERATE RISK', '4-3' => 'MODERATE TO HIGH RISK', '4-4' => 'HIGH RISK', '4-5' => 'HIGH RISK',
            '5-1' => 'MODERATE RISK', '5-2' => 'MODERATE TO HIGH RISK', '5-3' => 'HIGH RISK', '5-4' => 'HIGH RISK', '5-5' => 'HIGH RISK',
        ];
        $key = "{$prob}-{$dampak}";
        return $matrix[$key] ?? 'MODERATE RISK';
    }
}
