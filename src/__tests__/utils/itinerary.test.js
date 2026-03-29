import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStatusColor,
  getStatusLabel,
  getPreviewImage,
  formatDateRange,
  getTripDuration,
  isUpcoming,
  isOngoing,
  isCompleted,
  suggestStatus,
  getActivityCount,
  sortByDate,
  filterByStatus,
} from '../../utils/itinerary';
import { COLORS } from '../../constants/theme';

describe('itinerary utils', () => {
  describe('getStatusColor', () => {
    it('should return correct color for planning status', () => {
      const result = getStatusColor('planning');
      expect(result).toBe(COLORS.planning);
    });

    it('should return correct color for ongoing status', () => {
      const result = getStatusColor('ongoing');
      expect(result).toBe(COLORS.ongoing);
    });

    it('should return correct color for completed status', () => {
      const result = getStatusColor('completed');
      expect(result).toBe(COLORS.completed);
    });

    it('should return planning color for unknown status', () => {
      const result = getStatusColor('unknown');
      expect(result).toBe(COLORS.planning);
    });

    it('should return planning color for null status', () => {
      const result = getStatusColor(null);
      expect(result).toBe(COLORS.planning);
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for planning status', () => {
      const result = getStatusLabel('planning');
      expect(result).toBe('Planning');
    });

    it('should return correct label for ongoing status', () => {
      const result = getStatusLabel('ongoing');
      expect(result).toBe('Ongoing');
    });

    it('should return correct label for completed status', () => {
      const result = getStatusLabel('completed');
      expect(result).toBe('Completed');
    });

    it('should return original status for unknown status', () => {
      const result = getStatusLabel('custom');
      expect(result).toBe('custom');
    });
  });

  describe('getPreviewImage', () => {
    it('should return first image from images array', () => {
      const itinerary = {
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('https://example.com/image1.jpg');
    });

    it('should return image from image property', () => {
      const itinerary = {
        image: 'https://example.com/image.jpg',
      };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should return image from image_url property', () => {
      const itinerary = {
        image_url: 'https://example.com/image.jpg',
      };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should prioritize images array over image property', () => {
      const itinerary = {
        images: ['https://example.com/array.jpg'],
        image: 'https://example.com/single.jpg',
      };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('https://example.com/array.jpg');
    });

    it('should prioritize image over image_url', () => {
      const itinerary = {
        image: 'https://example.com/image.jpg',
        image_url: 'https://example.com/url.jpg',
      };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should return empty string for null itinerary', () => {
      const result = getPreviewImage(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined itinerary', () => {
      const result = getPreviewImage(undefined);
      expect(result).toBe('');
    });

    it('should return empty string when no images', () => {
      const itinerary = { title: 'Test' };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('');
    });

    it('should return empty string for empty images array', () => {
      const itinerary = { images: [] };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('');
    });

    it('should return empty string for empty image string', () => {
      const itinerary = { image: '' };
      const result = getPreviewImage(itinerary);
      expect(result).toBe('');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range in same year', () => {
      const result = formatDateRange('2024-01-15', '2024-01-22');
      expect(result).toBe('Jan 15 - Jan 22, 2024');
    });

    it('should format date range across different years', () => {
      const result = formatDateRange('2023-12-25', '2024-01-05');
      expect(result).toBe('Dec 25, 2023 - Jan 5, 2024');
    });

    it('should format single day trip', () => {
      const result = formatDateRange('2024-03-15', '2024-03-15');
      expect(result).toBe('Mar 15 - Mar 15, 2024');
    });

    it('should return empty string when start date is missing', () => {
      const result = formatDateRange('', '2024-01-22');
      expect(result).toBe('');
    });

    it('should return empty string when end date is missing', () => {
      const result = formatDateRange('2024-01-15', '');
      expect(result).toBe('');
    });

    it('should return empty string when both dates are missing', () => {
      const result = formatDateRange('', '');
      expect(result).toBe('');
    });

    it('should return empty string for null dates', () => {
      const result = formatDateRange(null, null);
      expect(result).toBe('');
    });
  });

  describe('getTripDuration', () => {
    it('should calculate duration for multi-day trip', () => {
      const result = getTripDuration('2024-01-15', '2024-01-22');
      expect(result).toBe(8); // 8 days including both start and end
    });

    it('should return 1 for single day trip', () => {
      const result = getTripDuration('2024-01-15', '2024-01-15');
      expect(result).toBe(1);
    });

    it('should return 0 when start date is missing', () => {
      const result = getTripDuration('', '2024-01-22');
      expect(result).toBe(0);
    });

    it('should return 0 when end date is missing', () => {
      const result = getTripDuration('2024-01-15', '');
      expect(result).toBe(0);
    });

    it('should return 0 when both dates are missing', () => {
      const result = getTripDuration('', '');
      expect(result).toBe(0);
    });

    it('should return 0 for null dates', () => {
      const result = getTripDuration(null, null);
      expect(result).toBe(0);
    });

    it('should handle end date before start date', () => {
      const result = getTripDuration('2024-01-22', '2024-01-15');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('isUpcoming', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-30'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for future date', () => {
      const result = isUpcoming('2024-04-15');
      expect(result).toBe(true);
    });

    it('should return false for today', () => {
      const result = isUpcoming('2024-03-30');
      expect(result).toBe(false);
    });

    it('should return false for past date', () => {
      const result = isUpcoming('2024-03-15');
      expect(result).toBe(false);
    });

    it('should return false for null date', () => {
      const result = isUpcoming(null);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = isUpcoming('');
      expect(result).toBe(false);
    });
  });

  describe('isOngoing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-30'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true when today is between start and end', () => {
      const result = isOngoing('2024-03-25', '2024-04-05');
      expect(result).toBe(true);
    });

    it('should return true when today is the start date', () => {
      const result = isOngoing('2024-03-30', '2024-04-05');
      expect(result).toBe(true);
    });

    it('should return true when today is the end date', () => {
      const result = isOngoing('2024-03-25', '2024-03-30');
      expect(result).toBe(true);
    });

    it('should return false when trip has not started', () => {
      const result = isOngoing('2024-04-01', '2024-04-10');
      expect(result).toBe(false);
    });

    it('should return false when trip has ended', () => {
      const result = isOngoing('2024-03-10', '2024-03-20');
      expect(result).toBe(false);
    });

    it('should return false for null dates', () => {
      const result = isOngoing(null, null);
      expect(result).toBe(false);
    });

    it('should return false for empty strings', () => {
      const result = isOngoing('', '');
      expect(result).toBe(false);
    });
  });

  describe('isCompleted', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-30'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for past end date', () => {
      const result = isCompleted('2024-03-20');
      expect(result).toBe(true);
    });

    it('should return false for today', () => {
      const result = isCompleted('2024-03-30');
      expect(result).toBe(false);
    });

    it('should return false for future end date', () => {
      const result = isCompleted('2024-04-15');
      expect(result).toBe(false);
    });

    it('should return false for null date', () => {
      const result = isCompleted(null);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = isCompleted('');
      expect(result).toBe(false);
    });
  });

  describe('suggestStatus', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-30'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should suggest ongoing for current trip', () => {
      const result = suggestStatus('2024-03-25', '2024-04-05');
      expect(result).toBe('ongoing');
    });

    it('should suggest completed for past trip', () => {
      const result = suggestStatus('2024-03-10', '2024-03-20');
      expect(result).toBe('completed');
    });

    it('should suggest planning for future trip', () => {
      const result = suggestStatus('2024-04-10', '2024-04-20');
      expect(result).toBe('planning');
    });

    it('should prioritize ongoing over completed', () => {
      const result = suggestStatus('2024-03-30', '2024-03-30');
      expect(result).toBe('ongoing');
    });
  });

  describe('getActivityCount', () => {
    it('should return count for array of activities', () => {
      const itinerary = {
        activities: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
      const result = getActivityCount(itinerary);
      expect(result).toBe(3);
    });

    it('should return 0 for empty activities array', () => {
      const itinerary = { activities: [] };
      const result = getActivityCount(itinerary);
      expect(result).toBe(0);
    });

    it('should return 0 when activities is null', () => {
      const itinerary = { activities: null };
      const result = getActivityCount(itinerary);
      expect(result).toBe(0);
    });

    it('should return 0 when activities is undefined', () => {
      const itinerary = {};
      const result = getActivityCount(itinerary);
      expect(result).toBe(0);
    });

    it('should return 0 for null itinerary', () => {
      const result = getActivityCount(null);
      expect(result).toBe(0);
    });

    it('should return 0 for undefined itinerary', () => {
      const result = getActivityCount(undefined);
      expect(result).toBe(0);
    });

    it('should return 0 when activities is not an array', () => {
      const itinerary = { activities: 'not-an-array' };
      const result = getActivityCount(itinerary);
      expect(result).toBe(0);
    });
  });

  describe('sortByDate', () => {
    const itineraries = [
      { id: 1, start_date: '2024-03-15', title: 'Trip 1' },
      { id: 2, start_date: '2024-01-10', title: 'Trip 2' },
      { id: 3, start_date: '2024-02-20', title: 'Trip 3' },
    ];

    it('should sort itineraries in ascending order by default', () => {
      const result = sortByDate(itineraries);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(1);
    });

    it('should sort itineraries in ascending order explicitly', () => {
      const result = sortByDate(itineraries, 'asc');
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(1);
    });

    it('should sort itineraries in descending order', () => {
      const result = sortByDate(itineraries, 'desc');
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(2);
    });

    it('should not mutate original array', () => {
      const original = [...itineraries];
      sortByDate(itineraries);
      expect(itineraries).toEqual(original);
    });

    it('should return empty array for null input', () => {
      const result = sortByDate(null);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const result = sortByDate(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      const result = sortByDate('not-an-array');
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = sortByDate([]);
      expect(result).toEqual([]);
    });

    it('should handle single item array', () => {
      const result = sortByDate([itineraries[0]]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(itineraries[0]);
    });
  });

  describe('filterByStatus', () => {
    const itineraries = [
      { id: 1, status: 'planning', title: 'Trip 1' },
      { id: 2, status: 'ongoing', title: 'Trip 2' },
      { id: 3, status: 'completed', title: 'Trip 3' },
      { id: 4, status: 'planning', title: 'Trip 4' },
    ];

    it('should filter itineraries by planning status', () => {
      const result = filterByStatus(itineraries, 'planning');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(4);
    });

    it('should filter itineraries by ongoing status', () => {
      const result = filterByStatus(itineraries, 'ongoing');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should filter itineraries by completed status', () => {
      const result = filterByStatus(itineraries, 'completed');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('should return all itineraries when status is null', () => {
      const result = filterByStatus(itineraries, null);
      expect(result).toHaveLength(4);
    });

    it('should return all itineraries when status is undefined', () => {
      const result = filterByStatus(itineraries, undefined);
      expect(result).toHaveLength(4);
    });

    it('should return all itineraries when status is empty string', () => {
      const result = filterByStatus(itineraries, '');
      expect(result).toHaveLength(4);
    });

    it('should return empty array for unknown status', () => {
      const result = filterByStatus(itineraries, 'unknown');
      expect(result).toHaveLength(0);
    });

    it('should return empty array for null input', () => {
      const result = filterByStatus(null, 'planning');
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const result = filterByStatus(undefined, 'planning');
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      const result = filterByStatus('not-an-array', 'planning');
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = filterByStatus([], 'planning');
      expect(result).toEqual([]);
    });
  });
});
