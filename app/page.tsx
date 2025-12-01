
//client side - optimization for dyanmic import 
'use client';

//various imports
import Image from "next/image";
import dynamic from 'next/dynamic';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

//constant and other imports for various tsx files
const FaultyTerminal = dynamic(() => import('./FaultyTerminal'), {
  ssr: false,
});
const LogoLoop = dynamic(() => import('./LogoLoop'), {
  ssr: false,
});
export default function Home() {
  return (
    <div className="fixed inset-0 flex h-screen w-screen overflow-x-hideen overflow-y-hidden z-[-1]" >
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
      {/* <FaultyTerminal
        scale={1.5}
        gridMul={[2, 2]}
        digitSize={1.2}
        timeScale={1}
        pause={false}
        scanlineIntensity={1}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0.5}
        tint="#199f4b"
        mouseReact={true}
        mouseStrength={0.5}
        pageLoadAnimation={false}
        brightness={1}
      /> */}
      {/* <Image
          className="dark:invert"
          src="/logo.svg"
          alt="Robotics Team logo"
          width={1000}
          height={1000}
          priority
        /> */}
      {/* flex min-h-screen w-full max-w-3xl flex-col */}
      {/* <div className="absolute items-center justify-center z-10">
        <Image
          className="
          absolute 
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2"
          src="/logo.svg"
          alt="Robotics Team logo"
          width={500}
          height={500}
          priority
        />
      </div> */}
      {/* <main className="items-center justify-center py-32 px-16 bg- sm:items-start"> */}
        
        {/* <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            FTC 26637 Circuit Crawlers
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div> */}
        {/* <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div> */}
      {/* </main> */}
    </div>
  );
}


