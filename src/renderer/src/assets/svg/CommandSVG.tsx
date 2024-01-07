import { SVGProps, memo } from "react"
export const CommandSVG = memo((props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        aria-hidden="true"
        className="w-6 h-6 text-gray-800 dark:text-white"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 6h8M6 6v8m0-8V3.5A2.5 2.5 0 1 0 3.5 6H6Zm8 0v8m0-8h2.5A2.5 2.5 0 1 0 14 3.5V6Zm0 8H6m8 0h2.5a2.5 2.5 0 1 1-2.5 2.5V14Zm-8 0H3.5A2.5 2.5 0 1 0 6 16.5V14Z"
        />
    </svg>
))
