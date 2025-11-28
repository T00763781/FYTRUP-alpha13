// ============================================================
// FYTRUP — Activity Stream Schema (Front-End Only)
// Supports: Your Path page, soft events, recent history
// ============================================================

// ------------------------
// 1. Event Categories
// ------------------------

export enum ActivityCategory {
  POI_Entered = "POI_Entered",
  Packmate_Discovered = "Packmate_Discovered",
  Chat_Unlocked = "Chat_Unlocked",
  Note_Collected = "Note_Collected",
  POI_Completed = "POI_Completed",
  Chat_Message = "Chat_Message", // user or NPC
  System = "System"              // fallback or misc
}

// ------------------------
// 2. Event Data Shape
// ------------------------

export interface ActivityEvent {
  id: string;                      // unique UUID-ish string
  category: ActivityCategory;
  timestamp: number;               // Date.now()
  poiId?: string;                  // optional link
  packmateId?: string;             // optional link
  noteId?: string;                 // optional link
  messagePreview?: string;         // short text for Chat_Message
  systemTag?: string;              // optional internal flag
}

// ------------------------
// 3. Pretty Labels (UI-facing, not personas)
// ------------------------

export const ACTIVITY_LABELS: Record<ActivityCategory, string> = {
  [ActivityCategory.POI_Entered]: "Entered a POI zone",
  [ActivityCategory.Packmate_Discovered]: "Met a new Packmate",
  [ActivityCategory.Chat_Unlocked]: "Unlocked chat",
  [ActivityCategory.Note_Collected]: "Collected a Note",
  [ActivityCategory.POI_Completed]: "Completed a POI",
  [ActivityCategory.Chat_Message]: "New chat activity",
  [ActivityCategory.System]: "System event"
};

// ------------------------
// 4. Helpers — ID generator
// ------------------------

function guid(): string {
  return "evt-" + Math.random().toString(36).slice(2, 10);
}

// ------------------------
// 5. Event Factory Helpers
// ------------------------

export const ActivityFactory = {
  poiEntered: (poiId: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.POI_Entered,
    timestamp: Date.now(),
    poiId
  }),

  packmateDiscovered: (packmateId: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.Packmate_Discovered,
    timestamp: Date.now(),
    packmateId
  }),

  chatUnlocked: (packmateId: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.Chat_Unlocked,
    timestamp: Date.now(),
    packmateId
  }),

  noteCollected: (noteId: string, poiId: string, packmateId: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.Note_Collected,
    timestamp: Date.now(),
    noteId,
    poiId,
    packmateId
  }),

  poiCompleted: (poiId: string, packmateId: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.POI_Completed,
    timestamp: Date.now(),
    poiId,
    packmateId
  }),

  chatMessage: (packmateId: string, preview: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.Chat_Message,
    timestamp: Date.now(),
    packmateId,
    messagePreview: preview
  }),

  system: (tag: string): ActivityEvent => ({
    id: guid(),
    category: ActivityCategory.System,
    timestamp: Date.now(),
    systemTag: tag
  })
};

// ------------------------
// 6. Presenter Helper (UI formatting)
// ------------------------

export function formatActivityEvent(ev: ActivityEvent): string {
  const base = ACTIVITY_LABELS[ev.category] ?? "Activity";
  const time = new Date(ev.timestamp).toLocaleString();

  switch (ev.category) {
    case ActivityCategory.Chat_Message:
      return `${base}: ${ev.messagePreview ?? ""} • ${time}`;

    case ActivityCategory.Note_Collected:
      return `${base} (${ev.noteId}) • ${time}`;

    case ActivityCategory.Packmate_Discovered:
      return `${base} (${ev.packmateId}) • ${time}`;

    default:
      return `${base} • ${time}`;
  }
}
