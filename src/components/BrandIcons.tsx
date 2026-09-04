interface ScanIconProps {
  size?: number;
  className?: string;
}

export function ScanIcon({ size = 24, className = '' }: ScanIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8.5V6a3 3 0 0 1 3-3h2.5M16.5 3H19a3 3 0 0 1 3 3v2.5M21 16.5V19a3 3 0 0 1-3 3h-2.5M7.5 21H5a3 3 0 0 1-3-3v-2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5c-1.2 0-2.2.5-3 1.3M12 8.5c1.2 0 2.2.5 3 1.3M12 8.5c-1.8-1.8-4.5-1.5-6 .5M12 8.5c1.8-1.8 4.5-1.5 6 .5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <circle cx="12" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function LeafWatermark({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 4C14 4 6 12 6 24c0 8 4 14 10 18 0-10 4-16 8-20-4 6-6 12-6 20 2 1 4 2 6 2 12 0 18-8 18-20S34 4 24 4z"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M24 10c-7 0-13 6-13 14 0 5 3 9 6 11 0-6 3-10 7-13-3 4-4 8-4 13 1 0 2 1 4 1 8 0 12-5 12-13S31 10 24 10z"
        fill="currentColor"
        opacity="0.04"
      />
    </svg>
  );
}
