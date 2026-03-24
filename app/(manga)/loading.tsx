/**
 * Loading state for the (manga) route group.
 * Returns null because child routes (browse, manga/[slug], chapter)
 * each have their own specific loading skeletons.
 * Having a parent skeleton here causes the wrong skeleton to flash
 * before the child skeleton renders.
 */
export default function MangaLoading() {
  return null;
}
