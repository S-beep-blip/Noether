"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <Icons.googleDrive />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.HumeAI />
          </Circle>
          <Circle ref={div3Ref} className="size-16">
            <Icons.GeminiAI />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.TavilyAI/>
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.notion />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          {/* Increased size from size-16 to size-20 and reduced padding */}
          <Circle ref={div6Ref} className="size-20 p-2">
            <Icons.Noether />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icons.user />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
{/* Beam from Noether to user (new yellow-orange gradient) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        gradientStartColor="#ffde59"
        gradientStopColor="#ff914d"
      />
    </div>
  );
}

const Icons = {
  notion: () => (
    <svg 
      width="100" 
      height="100" 
      viewBox="0 0 180 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      transform="scale(1.5)"
    >
      <mask 
      id="mask0_408_139" 
      style={{ maskType: "alpha" }} 
      maskUnits="userSpaceOnUse" 
      x="0" 
      y="0" 
      width="180" 
      height="180"
      >
      <circle cx="90" cy="90" r="90" fill="black"/>
      </mask>
      <g mask="url(#mask0_408_139)">
      <circle 
        cx="90" 
        cy="90" 
        r="87" 
        fill="black" 
        stroke="white" 
        strokeWidth="6"
      />
      <path 
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" 
        fill="url(#paint0_linear_408_139)"
      />
      <rect 
        x="115" 
        y="54" 
        width="12" 
        height="72" 
        fill="url(#paint1_linear_408_139)"
      />
      </g>
      <defs>
      <linearGradient 
        id="paint0_linear_408_139" 
        x1="109" 
        y1="116.5" 
        x2="144.5" 
        y2="160.5" 
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient 
        id="paint1_linear_408_139" 
        x1="121" 
        y1="54" 
        x2="120.799" 
        y2="106.875" 
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      </defs>
    </svg>

  ),
  Noether: () => (
 <svg 
      width="100" 
      height="100" 
      viewBox="0 0 375 375" 
      transform="scale(1.2)">
      xmlns="http://www.w3.org/2000/svg"
      <defs>
        <clipPath id="clip1">
          <path d="M 72.402344 81.703125 L 187.5 81.703125 L 187.5 261.820312 L 72.402344 261.820312 Z"/>
        </clipPath>
        <clipPath id="clip2">
          <path d="M 187.5 113.179688 L 302.597656 113.179688 L 302.597656 293.296875 L 187.5 293.296875 Z"/>
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#clip1)">
          <path 
            d="M 72.402344 81.703125 L 187.5 81.703125 L 187.5 261.992188 L 72.402344 261.992188 Z" 
            fill="#000000"
          />
        </g>
        <g clipPath="url(#clip2)">
          <path 
            d="M 187.5 113.179688 L 302.597656 113.179688 L 302.597656 293.46875 L 187.5 293.46875 Z" 
            fill="#ffbd59"
          />
        </g>
        <path 
          d="M 0.0000479299 0.999517 L 125.529799 1.000161" 
          transform="matrix(1.8338,1.685597,-1.685597,1.8338,74.083132,79.881849)"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
        <path 
          d="M -0.000249052 0.999375 L 110.010613 0.999833" 
          transform="matrix(2.092472,-1.351154,1.351154,2.092472,71.048649,259.720999)"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
      </g>
    </svg>
  ),
  googleDrive: () => (
    <svg 
      viewBox="0 0 109 113" 
      transform="scale(1.5)" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" 
        fill="url(#paint0_linear)"
      />
      <path 
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" 
        fill="url(#paint1_linear)" 
        fillOpacity="0.2"
      />
      <path 
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" 
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient 
          id="paint0_linear" 
          x1="53.9738" 
          y1="54.974" 
          x2="94.1635" 
          y2="71.8295" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361"/>
          <stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
        <linearGradient 
          id="paint1_linear" 
          x1="36.1558" 
          y1="30.578" 
          x2="54.4844" 
          y2="65.0806" 
          gradientUnits="userSpaceOnUse"
        >
          <stop/>
          <stop offset="1" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>

  ),
  GeminiAI: () => (
    <svg 
      height="100" 
      width="100" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Gemini</title>
      <defs>
      <linearGradient 
      id="lobe-icons-gemini-fill" 
      x1="0%" 
      x2="68.73%" 
      y1="100%" 
      y2="30.395%"
      >
      <stop offset="0%" stopColor="#1C7DFF"></stop>
      <stop offset="52.021%" stopColor="#1C69FF"></stop>
      <stop offset="100%" stopColor="#F0DCD6"></stop>
      </linearGradient>
      </defs>
      <path 
      d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12" 
      fill="url(#lobe-icons-gemini-fill)" 
      fillRule="nonzero"
      />
    </svg>
    ),
    HumeAI: () => (
    <svg  transform="scale(2)" viewBox="0 0 1200 1200" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M242.943 604.746C201.077 614.359 175.024 653.95 185.206 696.387C194.82 738.821 235.548 763.738 276.846 754.122C318.712 744.51 344.196 704.918 334.582 662.484C324.969 619.993 284.241 595.134 242.943 604.746Z" fill="#FFB5D6"/>
    <path d="M279.093 444.599C312.484 471.22 359.413 466.67 386.603 432.71C413.736 398.75 407.536 351.822 374.715 325.2C341.893 298.579 294.338 303.129 267.205 337.089C240.071 371.048 246.272 417.977 279.093 444.599Z" fill="#D2A7E9"/>
    <path d="M481.686 846.912C442.664 828.255 397.953 844.069 379.296 882.58C360.638 921.032 375.883 965.744 414.962 984.969C453.984 1003.63 498.694 987.815 517.352 949.304C535.441 910.281 520.765 865.572 481.686 846.912Z" fill="#FFDCDC"/>
    <path d="M717.045 846.879C678.024 865.535 662.72 910.815 681.38 949.268C700.037 987.723 744.178 1004.16 783.769 984.935C822.793 966.279 838.094 920.999 819.437 882.546C800.777 844.091 756.126 827.651 717.045 846.879Z" fill="#FFD1A4"/>
    <path d="M955.866 604.743C914 595.131 873.841 620.047 864.228 662.481C854.613 704.915 880.097 745.074 921.963 754.119C963.829 763.734 1003.99 738.818 1013.6 696.384C1023.22 653.95 997.732 614.359 955.866 604.743Z" fill="url(#paint0_linear_243_2)"/>
    <path d="M930.389 444.667C963.782 418.045 969.412 371.116 942.279 337.156C915.146 303.197 868.159 298.703 834.77 325.268C801.377 351.89 795.746 398.818 822.879 432.778C850.07 466.737 896.999 471.231 930.389 444.667Z" fill="#A0B0F6"/>
    <path d="M599.384 177C555.239 177 522.418 210.959 522.418 253.963C522.418 296.967 555.239 330.927 599.384 330.927C642.953 330.927 676.346 296.967 676.346 253.963C676.288 210.902 642.953 177 599.384 177Z" fill="#BBABED"/>
    <defs>
        <linearGradient id="paint0_linear_243_2" x1="917.02" y1="753.152" x2="959.498" y2="610.135" gradientUnits="userSpaceOnUse">
            <stop offset="0.2656" stopColor="#FFB7B2"/>
            <stop offset="0.5781" stopColor="#AB9EFC"/>
        </linearGradient>
    </defs>
</svg>

  ),
  zapier: () => (
    <svg
      width="105"
      height="28"
      viewBox="0 0 244 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M57.1877 45.2253L57.1534 45.1166L78.809 25.2914V15.7391H44.0663V25.2914H64.8181L64.8524 25.3829L43.4084 45.2253V54.7775H79.1579V45.2253H57.1877Z"
        fill="#201515"
      />
      <path
        d="M100.487 14.8297C96.4797 14.8297 93.2136 15.434 90.6892 16.6429C88.3376 17.6963 86.3568 19.4321 85.0036 21.6249C83.7091 23.8321 82.8962 26.2883 82.6184 28.832L93.1602 30.3135C93.5415 28.0674 94.3042 26.4754 95.4482 25.5373C96.7486 24.5562 98.3511 24.0605 99.9783 24.136C102.118 24.136 103.67 24.7079 104.634 25.8519C105.59 26.9959 106.076 28.5803 106.076 30.6681V31.7091H95.9401C90.7807 31.7091 87.0742 32.8531 84.8206 35.1411C82.5669 37.429 81.442 40.4492 81.4458 44.2014C81.4458 48.0452 82.5707 50.9052 84.8206 52.7813C87.0704 54.6574 89.8999 55.5897 93.3089 55.5783C97.5379 55.5783 100.791 54.1235 103.067 51.214C104.412 49.426 105.372 47.3793 105.887 45.2024H106.27L107.723 54.7546H117.275V30.5651C117.275 25.5659 115.958 21.6936 113.323 18.948C110.688 16.2024 106.409 14.8297 100.487 14.8297ZM103.828 44.6475C102.312 45.9116 100.327 46.5408 97.8562 46.5408C95.8199 46.5408 94.4052 46.1843 93.6121 45.4712C93.2256 45.1338 92.9182 44.7155 92.7116 44.246C92.505 43.7764 92.4043 43.2671 92.4166 42.7543C92.3941 42.2706 92.4702 41.7874 92.6403 41.3341C92.8104 40.8808 93.071 40.4668 93.4062 40.1174C93.7687 39.7774 94.1964 39.5145 94.6633 39.3444C95.1303 39.1743 95.6269 39.1006 96.1231 39.1278H106.093V39.7856C106.113 40.7154 105.919 41.6374 105.527 42.4804C105.134 43.3234 104.553 44.0649 103.828 44.6475Z"
        fill="#201515"
      />
      <path
        d="M175.035 15.7391H163.75V54.7833H175.035V15.7391Z"
        fill="#201515"
      />
      <path
        d="M241.666 15.7391C238.478 15.7391 235.965 16.864 234.127 19.1139C232.808 20.7307 231.805 23.1197 231.119 26.2809H230.787L229.311 15.7391H219.673V54.7775H230.959V34.7578C230.959 32.2335 231.55 30.2982 232.732 28.9521C233.914 27.606 236.095 26.933 239.275 26.933H243.559V15.7391H241.666Z"
        fill="#201515"
      />
      <path
        d="M208.473 17.0147C205.839 15.4474 202.515 14.6657 198.504 14.6695C192.189 14.6695 187.247 16.4675 183.678 20.0634C180.108 23.6593 178.324 28.6166 178.324 34.9352C178.233 38.7553 179.067 42.5407 180.755 45.9689C182.3 49.0238 184.706 51.5592 187.676 53.2618C190.665 54.9892 194.221 55.8548 198.344 55.8586C201.909 55.8586 204.887 55.3095 207.278 54.2113C209.526 53.225 211.483 51.6791 212.964 49.7211C214.373 47.7991 215.42 45.6359 216.052 43.3377L206.329 40.615C205.919 42.1094 205.131 43.4728 204.041 44.5732C202.942 45.6714 201.102 46.2206 198.521 46.2206C195.451 46.2206 193.163 45.3416 191.657 43.5837C190.564 42.3139 189.878 40.5006 189.575 38.1498H216.201C216.31 37.0515 216.367 36.1306 216.367 35.387V32.9561C216.431 29.6903 215.757 26.4522 214.394 23.4839C213.118 20.7799 211.054 18.5248 208.473 17.0147ZM198.178 23.9758C202.754 23.9758 205.348 26.2275 205.962 30.731H189.775C190.032 29.2284 190.655 27.8121 191.588 26.607C193.072 24.8491 195.268 23.972 198.178 23.9758Z"
        fill="#201515"
      />
      <path
        d="M169.515 0.00366253C168.666 -0.0252113 167.82 0.116874 167.027 0.421484C166.234 0.726094 165.511 1.187 164.899 1.77682C164.297 2.3723 163.824 3.08658 163.512 3.87431C163.2 4.66204 163.055 5.50601 163.086 6.35275C163.056 7.20497 163.201 8.05433 163.514 8.84781C163.826 9.64129 164.299 10.3619 164.902 10.9646C165.505 11.5673 166.226 12.0392 167.02 12.3509C167.814 12.6626 168.663 12.8074 169.515 12.7762C170.362 12.8082 171.206 12.6635 171.994 12.3514C172.782 12.0392 173.496 11.5664 174.091 10.963C174.682 10.3534 175.142 9.63077 175.446 8.83849C175.75 8.04621 175.89 7.20067 175.859 6.35275C175.898 5.50985 175.761 4.66806 175.456 3.88115C175.151 3.09424 174.686 2.37951 174.09 1.78258C173.493 1.18565 172.779 0.719644 171.992 0.414327C171.206 0.109011 170.364 -0.0288946 169.521 0.00938803L169.515 0.00366253Z"
        fill="#201515"
      />
      <path
        d="M146.201 14.6695C142.357 14.6695 139.268 15.8764 136.935 18.2902C135.207 20.0786 133.939 22.7479 133.131 26.2981H132.771L131.295 15.7563H121.657V66H132.942V45.3054H133.354C133.698 46.6852 134.181 48.0267 134.795 49.3093C135.75 51.3986 137.316 53.1496 139.286 54.3314C141.328 55.446 143.629 56.0005 145.955 55.9387C150.68 55.9387 154.277 54.0988 156.748 50.419C159.219 46.7392 160.455 41.6046 160.455 35.0153C160.455 28.6509 159.259 23.6689 156.869 20.0691C154.478 16.4694 150.922 14.6695 146.201 14.6695ZM147.345 42.9602C146.029 44.8668 143.97 45.8201 141.167 45.8201C140.012 45.8735 138.86 45.6507 137.808 45.1703C136.755 44.6898 135.832 43.9656 135.116 43.0574C133.655 41.2233 132.927 38.7122 132.931 35.5243V34.7807C132.931 31.5432 133.659 29.0646 135.116 27.3448C136.572 25.625 138.59 24.7747 141.167 24.7937C144.02 24.7937 146.092 25.6994 147.385 27.5107C148.678 29.322 149.324 31.8483 149.324 35.0896C149.332 38.4414 148.676 41.065 147.356 42.9602H147.345Z"
        fill="#201515"
      />
      <path d="M39.0441 45.2253H0V54.789H39.0441V45.2253Z" fill="#FF4F00" />
    </svg>
  ),
  TavilyAI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" transform="translate(3, -1) scale(1.5)" viewBox="0 0 44 42" fill="none" style={{ display: "block" }}>
      <path d="m16.44.964 4.921 7.79c.79 1.252-.108 2.883-1.588 2.883H17.76V23.3h-2.91V.088c.61 0 1.22.292 1.59.876" fill="#8FBCFA"/>
      <path d="M8.342 8.755 13.263.964a1.86 1.86 0 0 1 1.59-.876V23.3a5 5 0 0 0-.252-.006c-.99 0-1.907.311-2.658.842V11.637H9.93c-1.48 0-2.38-1.631-1.589-2.882z" fill="#468BFF"/>
      <path d="M30.278 31H18.031a4.6 4.6 0 0 0 1.219-2.91h22.577c0 .61-.292 1.22-.875 1.59L33.16 34.6c-1.251.791-2.883-.108-2.883-1.588V31z" fill="#FDBB11"/>
      <path d="m33.16 21.581 7.79 4.921c.585.369.876.979.876 1.589H19.25a4.62 4.62 0 0 0-.858-2.91h11.887V23.17c0-1.48 1.631-2.38 2.882-1.589z" fill="#F6D785"/>
      <path d="m8.24 34.25-7.107 7.108a1.86 1.86 0 0 0 1.742.504l8.989-2.03c1.443-.325 1.961-2.114.915-3.16l-1.423-1.423 5.356-5.356a2.805 2.805 0 0 0 0-3.966l-.074-.075z" fill="#FF9A9D"/>
      <path d="m7.243 31.135 5.355-5.356a2.805 2.805 0 0 1 3.967 0l.074.074-8.397 8.397-7.108 7.108a1.86 1.86 0 0 1-.504-1.742l2.029-8.989c.325-1.444 2.115-1.961 3.161-.915z" fill="#FE363B"/>
    </svg>
  ),  
  user: () => ( 
       <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
