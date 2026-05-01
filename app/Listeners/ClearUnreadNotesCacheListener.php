<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use App\Events\CacheClearedEvent;
use App\Services\CacheService;
use Illuminate\Queue\InteractsWithQueue;

class ClearUnreadNotesCacheListener
{
    protected $cacheService;
    /**
     * Create the event listener.
     */
    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Handle the event.
     * @param  \App\Events\CacheClearedEvent  $event
     * @return void
     */
    public function handle(CacheClearedEvent $event): void
    {
        // Log::info('ClearUnreadNotesCacheListener');
        // Call the method to flush the cache for the specific user
        $this->cacheService->flushUnreadNotesCache($event->userId);
    }
}
