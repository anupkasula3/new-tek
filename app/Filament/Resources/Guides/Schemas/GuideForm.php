<?php
namespace App\Filament\Resources\Guides\Schemas;

use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Fieldset;

use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class GuideForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Guide Tabs')
            ->columnSpanFull()
            ->tabs([ // ---------------- General Info ----------------
                Tab::make('General Info')
                ->schema([
                    TextInput::make('title')->required()
                                ->live(debounce: 500)
                                ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                    if ($operation === 'create') {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                    TextInput::make('slug')->required()
                                ->live(debounce: 500)
                                ->unique(table: 'guides', ignoreRecord: true)
                                ->dehydrated()
                                ->helperText(fn ($state) => $state ? url('/guide/' . $state) : null),
                    TextInput::make('subtitle')->columnSpanFull(),
                    MediaPicker::make('cover_image')
                    ->label('Cover Image')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                    MediaPicker::make('icon')
                    ->label('Icon')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    TextInput::make('heading')->columnSpanFull(),
                    TextInput::make('subheading')->columnSpanFull(),
                    TinyEditor::make('description')
                    ->columnSpanFull(),
                ])
                ->columns(2),
                // ---------------- Quick Facts ----------------
                Tab::make('Quick Facts')
                ->schema([
                    Repeater::make('quick_facts')
                    ->schema([
                        TextInput::make('label')->placeholder('e.g., Duration'),
                        TextInput::make('fact')->placeholder('e.g., Best Season: Spring & Autumn'),
                    ])
                    ->columns(2)
                    ->reorderable(),
                ]),
                // Expert Tip
                Tab::make('Expert Tips')
                ->schema([
                    Repeater::make('expert_tips')
                    ->schema([
                        MediaPicker::make('icon')
                        ->label('Icon')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                        TextInput::make('title')->placeholder('e.g., Expert Tip from Our Lead Guide'),
                        TextInput::make('guide')->placeholder('e.g., Pemba Sherpa, Lead Guide (15+ years experience'),
                        TinyEditor::make('content')->columnSpanFull()->placeholder('e.g., Always carry a good quality rain jacket...')
                        ->columnSpanFull(),
                    ])
                    ->columns(3)
                    ->reorderable()
                    ->columnSpanFull(),
                ]),
                // ---------------- Related Guides ----------------

                // Tab::make('Related Guides')
                // ->schema([
                    // \Filament\Schemas\Components\Section::make('Complete Packing List')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.complete_packing_list.title')
                    //     ->label('Packing List Title'),
                    //     TextInput::make('related_guides.complete_packing_list.subtitle')
                    //     ->label('Packing List Subtitle'),
                    //     MediaPicker::make('related_guides.complete_packing_list.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.complete_packing_list.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.complete_packing_list.heading'),
                    //     TextInput::make('related_guides.complete_packing_list.subheading'),

                    //     TinyEditor::make('related_guides.complete_packing_list.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),

                    //     Repeater::make('related_guides.complete_packing_list.important_notices')
                    //     ->schema([
                    //         Select::make('icon')
                    //         ->options([
                    //             'tick' => 'Tick',
                    //             'warning' => 'Warning',
                    //             'note' => 'Note',
                    //         ])
                    //         ->label('Icon')
                    //         ->default('tick'),
                    //         TextInput::make('title')->placeholder('e.g., Essential Items'),
                    //         Textarea::make('description'),
                    //     ])
                    //     ->columns(3)
                    //     ->reorderable()
                    //     ->columnSpanFull(),

                    //     Repeater::make('related_guides.complete_packing_list.categories')->label('Packing List Categories')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Waterproof Jacket'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             Select::make('icon')
                    //             ->options([
                    //                 'tick' => 'Tick',
                    //                 'uncheck' => 'Uncheck',
                    //             ])
                    //             ->label('Icon')
                    //             ->default('tick'),
                    //             TextInput::make('title')->placeholder('e.g., Gore-Tex or similar material'),
                    //             TextInput::make('quantity')->placeholder('e.g., 1'),
                    //         ])
                    //         ->columns(3)
                    //         ->reorderable()
                    //         ->label('Items')
                    //         ->columnSpanFull(),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),

                    //     Repeater::make('related_guides.complete_packing_list.tips')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Pack a first aid kit'),
                    //         Textarea::make('description'),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                    // \Filament\Schemas\Components\Section::make('Altitude Sickness Prevention Guide')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.altitude_sickness.title')
                    //     ->label('Altitude Sickness Prevention Title'),
                    //     TextInput::make('related_guides.altitude_sickness.subtitle')
                    //     ->label('Altitude Sickness Prevention Subtitle'),
                    //     MediaPicker::make('related_guides.altitude_sickness.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.altitude_sickness.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.altitude_sickness.heading'),
                    //     TextInput::make('related_guides.altitude_sickness.subheading'),
                    //     TinyEditor::make('related_guides.altitude_sickness.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.altitude_sickness.symptoms')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Mild AMS'),
                    //         Select::make('color')
                    //         ->options([
                    //             'yellow' => 'Yellow',
                    //             'orange' => 'Orange',
                    //             'red' => 'Red',
                    //         ])
                    //         ->label('Color Theme')
                    //         ->default('red'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             Select::make('icon')
                    //             ->options([
                    //                 'tick' => 'Tick',
                    //                 'warning' => 'Warning',
                    //             ])
                    //             ->label('Icon')
                    //             ->default('warning'),
                    //             TextInput::make('title'),
                    //         ])
                    //         ->columns(2)
                    //         ->reorderable()
                    //         ->label('Symptom Details')
                    //         ->columnSpanFull(),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.altitude_sickness.prevention_strategies')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Ascend Gradually'),
                    //         Textarea::make('description'),
                    //         MediaPicker::make('icon')
                    //         ->label('Icon')
                    //         ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //         ->disk('direct_public')
                    //         ->directory('uploads')
                    //         ->visibility('public')
                    //         ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.altitude_sickness.treatment_protocol')
                    //     ->schema([
                    //         TinyEditor::make('content')->placeholder('e.g., Immediate Actions'),
                    //         TinyEditor::make('notification_box')->placeholder('e.g., When to Descend'),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.altitude_sickness.medications')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Acetazolamide (Diamox)'),
                    //         TinyEditor::make('description'),
                    //         TinyEditor::make('important_note'),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                    // \Filament\Schemas\Components\Section::make('Photography Tips')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.photography_tips.title')
                    //     ->label('Photography Tips Title'),
                    //     TextInput::make('related_guides.photography_tips.subtitle')
                    //     ->label('Photography Tips Subtitle'),
                    //     MediaPicker::make('related_guides.photography_tips.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.photography_tips.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.photography_tips.heading'),
                    //     TextInput::make('related_guides.photography_tips.subheading'),
                    //     TinyEditor::make('related_guides.photography_tips.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.photography_tips.tips')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Use a Polarizing Filter'),
                    //         MediaPicker::make('icon')
                    //         ->label('Icon')
                    //         ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //         ->disk('direct_public')
                    //         ->directory('uploads')
                    //         ->visibility('public')
                    //         ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    //         TinyEditor::make('description'),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.photography_tips.recommended_gear')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., DSLR or Mirrorless Camera'),
                    //         Textarea::make('description'),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.photography_tips.must_capture_moments')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Sunrise over the Himalayas'),
                    //         TextInput::make('description'),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                    // \Filament\Schemas\Components\Section::make('Nepal Visa')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.nepal_visa.title')
                    //     ->label('Nepal Visa Information Title'),
                    //     TextInput::make('related_guides.nepal_visa.subtitle')
                    //     ->label('Nepal Visa Information Subtitle'),
                    //     MediaPicker::make('related_guides.nepal_visa.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.nepal_visa.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.nepal_visa.heading'),
                    //     TextInput::make('related_guides.nepal_visa.subheading'),
                    //     TinyEditor::make('related_guides.nepal_visa.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.nepal_visa.visa_options')
                    //     ->schema([
                    //         TextInput::make('duration')->placeholder('e.g., 15 Days'),
                    //         TextInput::make('price')->placeholder('e.g., $30 USD'),
                    //         TextInput::make('description')->placeholder('e.g., Can be extended'),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.nepal_visa.required_documents')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Valid Passport'),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.nepal_visa.application_process')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Step 1: Fill Out the Application Form'),
                    //         Textarea::make('description'),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.nepal_visa.important_notes')
                    //     ->schema([
                    //         Select::make('color')
                    //         ->options([
                    //             'info' => 'Info',
                    //             'warning' => 'Warning',
                    //             'danger' => 'Danger',
                    //             'success' => 'Success',
                    //             'dark' => 'Dark',
                    //         ])
                    //         ->label('Color')
                    //         ->default('info'),
                    //         TextInput::make('title')->placeholder('e.g., Visa Extension Tips'),
                    //         Textarea::make('description'),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                    // \Filament\Schemas\Components\Section::make('Choosing an Agency')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.choosing_agency.title')
                    //     ->label('Choosing an Agency Title'),
                    //     TextInput::make('related_guides.choosing_agency.subtitle')
                    //     ->label('Choosing an Agency Subtitle'),
                    //     MediaPicker::make('related_guides.choosing_agency.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.choosing_agency.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.choosing_agency.heading'),
                    //     TextInput::make('related_guides.choosing_agency.subheading'),
                    //     TinyEditor::make('related_guides.choosing_agency.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.choosing_agency.selection_criteria')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Experience and Expertise'),
                    //         MediaPicker::make('icon')
                    //         ->label('Icon')
                    //         ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //         ->disk('direct_public')
                    //         ->directory('uploads')
                    //         ->visibility('public')
                    //         ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             TextInput::make('title'),
                    //         ])
                    //         ->reorderable(),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.choosing_agency.questions_to_ask')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., What is your cancellation policy?'),
                    //     ])
                    //     ->columns(1)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.choosing_agency.warning_signs')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Lack of Transparency'),
                    //         Textarea::make('description'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             TextInput::make('title'),
                    //         ])
                    //         ->reorderable(),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     FieldSet::make('Why Choose Us')
                    //     ->schema([
                    //         TextInput::make('related_guides.choosing_agency.why_choose_us.title')->placeholder('e.g., Why Choose an Agency?')->columns(1),
                    //         TextInput::make('related_guides.choosing_agency.why_choose_us.subtitle')->placeholder('e.g., Support Local Communities')->columns(1),
                    //         TextInput::make('related_guides.choosing_agency.why_choose_us.link_label')->placeholder('e.g., Read More')->columns(1),
                    //         TextInput::make('related_guides.choosing_agency.why_choose_us.link_url')->placeholder('e.g., https://www.example.com')->columns(1),
                    //         TinyEditor::make('related_guides.choosing_agency.why_choose_us.content')->columnSpanFull(),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                    // \Filament\Schemas\Components\Section::make('Post-Trek Recovery')
                    // ->collapsible()
                    // ->collapsed()
                    // ->schema([
                    //     TextInput::make('related_guides.post_trek_recovery.title')
                    //     ->label('Post-Trek Recovery Title'),
                    //     TextInput::make('related_guides.post_trek_recovery.subtitle')
                    //     ->label('Post-Trek Recovery Subtitle'),
                    //     MediaPicker::make('related_guides.post_trek_recovery.cover_image')
                    //     ->label('Cover Image')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                    //     MediaPicker::make('related_guides.post_trek_recovery.icon')
                    //     ->label('Icon')
                    //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //     ->disk('direct_public')
                    //     ->directory('uploads')
                    //     ->visibility('public')
                    //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                    //     TextInput::make('related_guides.post_trek_recovery.heading'),
                    //     TextInput::make('related_guides.post_trek_recovery.subheading'),
                    //     TinyEditor::make('related_guides.post_trek_recovery.content')
                    //     ->label('Description')
                    //     ->columnSpanFull(),
                    //     Repeater::make('related_guides.post_trek_recovery.timeline')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., First Week After the Trek')->columns(1),
                    //         TextInput::make('duration')->placeholder('e.g., 1-7 Days')->columns(1),
                    //         MediaPicker::make('icon')
                    //         ->label('Icon')
                    //         ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    //         ->disk('direct_public')
                    //         ->directory('uploads')
                    //         ->visibility('public')
                    //         ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    //         Textarea::make('description')
                    //         ->columnSpanFull(),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.post_trek_recovery.common_issues')
                    //     ->schema([
                    //         Select::make('color')
                    //         ->options([
                    //             'info' => 'Info',
                    //             'warning' => 'Warning',
                    //             'danger' => 'Danger',
                    //             'success' => 'Success',
                    //             'dark' => 'Dark',
                    //         ])
                    //         ->label('Color')
                    //         ->default('info'),
                    //         TextInput::make('title')->placeholder('e.g., Muscle Soreness'),
                    //         TinyEditor::make('description'),
                    //         TinyEditor::make('solution'),
                    //     ])
                    //     ->columns(3)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.post_trek_recovery.nutrition')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Focus on Protein and Hydration'),
                    //         TinyEditor::make('description'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             TextInput::make('title'),
                    //         ])
                    //         ->reorderable(),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     Repeater::make('related_guides.post_trek_recovery.medical_attention')
                    //     ->schema([
                    //         TextInput::make('title')->placeholder('e.g., Severe Fatigue or Weakness'),
                    //         Repeater::make('items')
                    //         ->schema([
                    //             TextInput::make('title'),
                    //         ])
                    //         ->reorderable(),
                    //     ])
                    //     ->columns(2)
                    //     ->columnSpanFull()
                    //     ->reorderable(),
                    //     FieldSet::make('Mental & Emotional Recovery')
                    //     ->schema([
                    //         TextInput::make('related_guides.post_trek_recovery.mental_recovery.title')->placeholder('e.g., Mental and Emotional Recovery'),
                    //         TextInput::make('related_guides.post_trek_recovery.mental_recovery.subtitle')->placeholder('e.g., Focus on Self-Care'),
                    //         TinyEditor::make('related_guides.post_trek_recovery.mental_recovery.content')
                    //         ->columnSpanFull(),
                    //     ])->columns(2)
                    //     ->columnSpanFull(),
                    // ])
                    // ->columns(2)
                    // ->columnSpanFull(),

                //     \Filament\Schemas\Components\Section::make('Linked Pages / Resources')
                //     ->collapsible()
                //     ->collapsed()
                //     ->schema([
                //         Repeater::make('related_guides.linked_pages')
                //         ->label('Linked Related Guides')
                //         ->schema([
                //             Select::make('guide_slug')
                //             ->label('Related Guide')
                //             ->options(fn () => \App\Models\RelatedGuide::where('status', 'published')->pluck('title', 'slug')->toArray())
                //             ->searchable()
                //             ->required(),
                //             TextInput::make('custom_title')
                //             ->label('Custom Title (Optional)')
                //             ->placeholder('Defaults to guide title if left blank'),
                //         ])
                //         ->columns(2)
                //         ->columnSpanFull()
                //         ->reorderable(),
                //     ])
                //     ->columns(1)
                //     ->columnSpanFull(),
                // ]),
                  Tab::make('Related Guides')
                        ->schema([
                           \Filament\Forms\Components\Select::make('relatedGuides')
                                        ->label('Related Guides')
                                        ->relationship('relatedGuides', 'title')
                                        ->multiple()
                                        ->preload()
                                        ->searchable(),
                        ]),

                Tab::make('SEO')
                    ->schema([
                        \App\Filament\Forms\SeoMetadataForm::make()
                    ]),
            ]),
        ]);
    }

}
