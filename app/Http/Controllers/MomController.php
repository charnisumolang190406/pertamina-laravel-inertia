<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mom;

class MomController extends Controller
{
    private $statusColors = [
        'Menunggu Review' => 'bg-yellow-100 text-yellow-800',
        'Approved' => 'bg-green-100 text-green-800',
        'Revisi' => 'bg-red-100 text-red-800',
    ];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fungsi' => ['required', 'string'],
            'isu' => ['required', 'string'],
            'tindak_lanjut' => ['required', 'string'],
            'status' => ['nullable', 'string'],
        ]);

        $status = $validated['status'] ?? 'Menunggu Review';
        $id = (int)(microtime(true) * 1000);
        
        Mom::create([
            'id' => $id,
            'fungsi' => $validated['fungsi'],
            'isu' => $validated['isu'],
            'tindak_lanjut' => $validated['tindak_lanjut'],
            'status' => $status,
            'statusColor' => $this->statusColors[$status] ?? 'bg-yellow-100 text-yellow-800',
            'feedback' => null,
        ]);

        return redirect()->back()->with('success', 'Review tindak lanjut berhasil diajukan dengan status Menunggu Review.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'fungsi' => ['required', 'string'],
            'isu' => ['required', 'string'],
            'tindak_lanjut' => ['required', 'string'],
            'status' => ['required', 'string'],
        ]);

        $mom = Mom::findOrFail($id);
        $mom->update([
            'fungsi' => $validated['fungsi'],
            'isu' => $validated['isu'],
            'tindak_lanjut' => $validated['tindak_lanjut'],
            'status' => $validated['status'],
            'statusColor' => $this->statusColors[$validated['status']] ?? 'bg-slate-100 text-slate-800',
        ]);

        return redirect()->back()->with('success', 'Komentar / tindak lanjut berhasil diubah.');
    }

    public function destroy($id)
    {
        Mom::destroy($id);
        return redirect()->back()->with('success', 'Komentar / tindak lanjut berhasil dihapus.');
    }

    public function feedback(Request $request, $id)
    {
        $validated = $request->validate([
            'feedback' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:Approved,Revisi,Menunggu Review'],
        ]);

        $mom = Mom::findOrFail($id);
        
        $fbText = $validated['feedback'];
        if ($fbText) {
            $reviewerName = auth()->user() ? auth()->user()->fullName : 'Reviewer';
            if (!str_contains($fbText, '- ' . $reviewerName)) {
                $fbText .= ' - ' . $reviewerName;
            }
        }

        $status = $validated['status'] ?? $mom->status;

        $mom->update([
            'feedback' => $fbText,
            'status' => $status,
            'statusColor' => $this->statusColors[$status] ?? $mom->statusColor,
        ]);

        return redirect()->back()->with('success', 'Feedback review berhasil disimpan dengan status: ' . $status);
    }
}
