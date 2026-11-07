const FOCUS_RING =
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2';

/** Shared focus-visible ring for interactive elements on the gray-900 page background. */
export const FOCUS_RING_ON_DARK = `${FOCUS_RING} focus-visible:ring-offset-gray-900`;

/** Shared focus-visible ring for interactive elements inside the white mobile drawer. */
export const FOCUS_RING_ON_LIGHT = `${FOCUS_RING} focus-visible:ring-offset-white`;
