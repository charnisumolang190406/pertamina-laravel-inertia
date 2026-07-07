<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarEvent;

class CalendarController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string'],
            'date' => ['required', 'string'],
        ]);

        $id = (int)(microtime(true) * 1000);
        CalendarEvent::create(array_merge(['id' => $id], $validated));

        return redirect()->back()->with('success', 'Agenda kegiatan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string'],
            'date' => ['required', 'string'],
        ]);

        $event = CalendarEvent::findOrFail($id);
        $event->update($validated);

        return redirect()->back()->with('success', 'Agenda kegiatan berhasil diubah.');
    }

    public function destroy($id)
    {
        CalendarEvent::destroy($id);
        return redirect()->back()->with('success', 'Agenda kegiatan berhasil dihapus.');
    }
}
