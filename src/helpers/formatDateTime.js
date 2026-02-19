// Converts date picker value to LocalDateTime format for API
export function toApiDateTime(dateString) {
    if (!dateString) {
        return null;
    }
    return `${dateString}T12:00:00`;
}

// Formats date string for display (en-GB: day month year)
export function toDisplayDate(dateString) {
    if (!dateString) {
        return null;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
