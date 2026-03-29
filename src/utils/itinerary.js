import { COLORS } from '../constants/theme';

export function getStatusColor(status) {
  const colors = {
    planning: COLORS.planning,
    ongoing: COLORS.ongoing,
    completed: COLORS.completed,
  };
  return colors[status] || colors.planning;
}

export function getStatusLabel(status) {
  const labels = {
    planning: 'Planning',
    ongoing: 'Ongoing',
    completed: 'Completed',
  };
  return labels[status] || status;
}

export function getPreviewImage(itinerary) {
  if (!itinerary) {
    return '';
  }

  if (Array.isArray(itinerary.images) && itinerary.images.length > 0) {
    return itinerary.images[0];
  }

  if (typeof itinerary.image === 'string' && itinerary.image) {
    return itinerary.image;
  }

  if (typeof itinerary.image_url === 'string' && itinerary.image_url) {
    return itinerary.image_url;
  }

  return '';
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return '';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };

  if (start.getFullYear() === end.getFullYear()) {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
  }

  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  return `${startStr} - ${endStr}`;
}

export function getTripDuration(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
}

export function isUpcoming(startDate) {
  if (!startDate) {
    return false;
  }

  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return start > today;
}

export function isOngoing(startDate, endDate) {
  if (!startDate || !endDate) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
}

export function isCompleted(endDate) {
  if (!endDate) {
    return false;
  }

  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return end < today;
}

export function suggestStatus(startDate, endDate) {
  if (isOngoing(startDate, endDate)) {
    return 'ongoing';
  }
  if (isCompleted(endDate)) {
    return 'completed';
  }
  return 'planning';
}

export function getActivityCount(itinerary) {
  if (!itinerary || !itinerary.activities) {
    return 0;
  }

  return Array.isArray(itinerary.activities) ? itinerary.activities.length : 0;
}

export function sortByDate(itineraries, order = 'asc') {
  if (!Array.isArray(itineraries)) {
    return [];
  }

  const sorted = [...itineraries].sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return sorted;
}

export function filterByStatus(itineraries, status) {
  if (!Array.isArray(itineraries)) {
    return [];
  }

  if (!status) {
    return itineraries;
  }

  return itineraries.filter(item => item.status === status);
}
