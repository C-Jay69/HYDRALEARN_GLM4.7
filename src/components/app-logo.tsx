import Image from 'next/image';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
       <Image 
        src="https://storage.googleapis.com/stabl-new-3rd-party-assets/misc-assets/hydralearn-logo-1024.png"
        alt="HydraLearn Logo"
        width={36}
        height={36}
       />
      <h1 className="font-headline text-lg font-bold text-sidebar-foreground">
        HydraLearn
      </h1>
    </div>
  );
}
