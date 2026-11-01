<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SubDestination;
use App\Models\Destination;
use App\Models\Trek;
use App\Models\Experience;
use App\Models\Package;

class SanitizeRichTextData extends Command
{
    protected $signature = 'data:sanitize-rich-text';
    protected $description = 'Ensures all fields used by RichEditor are strings or valid Tiptap JSON to prevent crashes';

    public function handle()
    {
        $this->info('Sanitizing SubDestinations...');
        SubDestination::all()->each(function ($item) {
            $changed = false;
            
            // Fix sub_destination_overview
            if (is_array($item->sub_destination_overview)) {
                $overview = $item->sub_destination_overview;
                foreach ($overview as &$section) {
                    if (isset($section['content']) && is_array($section['content'])) {
                        // If it's an array and DOES NOT look like Tiptap JSON (no 'type' key)
                        if (!isset($section['content']['type'])) {
                            $section['content'] = ''; // Reset to empty string
                            $changed = true;
                        }
                    }
                }
                if ($changed) $item->sub_destination_overview = $overview;
            }

            // Fix essential_info
            if (is_array($item->essential_info)) {
                $info = $item->essential_info;
                // best_time_to_visit
                if (isset($info['best_time_to_visit']['items'])) {
                    foreach ($info['best_time_to_visit']['items'] as &$subItem) {
                        if (isset($subItem['content']) && is_array($subItem['content'])) {
                            $subItem['content'] = '';
                            $changed = true;
                        }
                    }
                }
                // permits_and_fees
                if (isset($info['permits_and_fees']['items'])) {
                    foreach ($info['permits_and_fees']['items'] as &$subItem) {
                        if (isset($subItem['content']) && is_array($subItem['content'])) {
                            $subItem['content'] = '';
                            $changed = true;
                        }
                    }
                }
                // flights
                if (isset($info['flights']['tips']) && is_array($info['flights']['tips'])) {
                    $info['flights']['tips'] = '';
                    $changed = true;
                }
                if (isset($info['flights']['contents']) && is_array($info['flights']['contents'])) {
                    $info['flights']['contents'] = '';
                    $changed = true;
                }
                if ($changed) $item->essential_info = $info;
            }

            if ($changed) {
                $item->save();
                $this->line("Fixed SubDestination: {$item->name}");
            }
        });

        $this->info('Sanitization complete.');
    }
}
