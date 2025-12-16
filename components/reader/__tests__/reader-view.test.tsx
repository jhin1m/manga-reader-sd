import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ReaderView } from '../reader-view';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/lib/api/endpoints/chapter', () => ({
  chapterApi: {
    getDetail: jest.fn(),
    getImages: jest.fn(),
    trackView: jest.fn(),
  },
}));

jest.mock('@/lib/api/endpoints/manga', () => ({
  mangaApi: {
    getChapters: jest.fn(),
  },
}));

jest.mock('@/lib/hooks/use-comments', () => ({
  useChapterComments: () => ({ data: { items: [] }, isLoading: false }),
  useAddChapterComment: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('../reader-controls', () => ({
  ReaderControls: ({ onNavigateChapter }: any) => (
    <div data-testid="reader-controls">
      <button onClick={() => onNavigateChapter('chapter-2')}>Next Chapter</button>
    </div>
  ),
}));

jest.mock('../reader-image', () => ({
  ReaderImage: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid="reader-image" />
  ),
}));

jest.mock('@/components/comments/chapter-reader-comments', () => ({
  ChapterReaderComments: () => (
    <div data-testid="chapter-comments">Comments Section</div>
  ),
}));

const mockPush = jest.fn();
const mockRouter = { push: mockPush };

// Test data
const mockChapter = {
  id: 1,
  uuid: 'test-uuid',
  slug: 'chapter-1',
  name: 'Chapter 1',
  order: 1,
  content: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
};

const mockChapterList = {
  data: [
    { id: 1, uuid: 'test-uuid-1', slug: 'chapter-1', name: 'Chapter 1', order: 1, chapter_number: 1 },
    { id: 2, uuid: 'test-uuid-2', slug: 'chapter-2', name: 'Chapter 2', order: 2, chapter_number: 2 },
  ],
};

describe('ReaderView Navigation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    jest.clearAllMocks();
  });

  const renderReaderView = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ReaderView mangaSlug="test-manga" chapterSlug="chapter-1" />
      </QueryClientProvider>
    );
  };

  it('should render reader view', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    renderReaderView();

    await waitFor(() => {
      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    });
  });

  it('should advance page on right arrow press in single mode', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    renderReaderView();

    await waitFor(() => {
      // Change to single mode first
      const modeButton = screen.getByRole('button', { name: /single/i });
      fireEvent.click(modeButton);
    });

    // Press right arrow
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Verify page info shows page 2
    await waitFor(() => {
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  it('should go back page on left arrow press in single mode', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    renderReaderView();

    await waitFor(() => {
      // Change to single mode
      const modeButton = screen.getByRole('button', { name: /single/i });
      fireEvent.click(modeButton);
    });

    // Go to page 2 first
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // Then go back
    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    // Verify page info shows page 1
    await waitFor(() => {
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  it('should toggle controls on escape key press', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    renderReaderView();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    });

    // Press escape to hide controls
    fireEvent.keyDown(window, { key: 'Escape' });

    // Controls should be hidden (using pointerEvents: none)
    await waitFor(() => {
      const controls = screen.getByRole('button', { name: /previous/i });
      expect(controls).toHaveStyle({ pointerEvents: 'none' });
    });

    // Press escape again to show controls
    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      const controls = screen.getByRole('button', { name: /previous/i });
      expect(controls).toHaveStyle({ pointerEvents: 'auto' });
    });
  });

  it('should NOT navigate on spacebar press', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    renderReaderView();

    await waitFor(() => {
      // Check initial state
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    // Press spacebar
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: 'Space' }); // Alternative key value

    // Verify page hasn't changed
    await waitFor(() => {
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  it('should NOT scroll on spacebar press in long-strip mode', async () => {
    const { chapterApi } = require('@/lib/api/endpoints/chapter');
    const { mangaApi } = require('@/lib/api/endpoints/manga');

    chapterApi.getDetail.mockResolvedValue(mockChapter);
    chapterApi.getImages.mockResolvedValue({ images: mockChapter.content });
    mangaApi.getChapters.mockResolvedValue(mockChapterList);

    // Mock window.scrollBy
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation();

    renderReaderView();

    await waitFor(() => {
      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    });

    // Press spacebar in long-strip mode (default)
    fireEvent.keyDown(window, { key: ' ' });

    // Verify scrollBy was not called
    expect(scrollBySpy).not.toHaveBeenCalled();

    scrollBySpy.mockRestore();
  });
});