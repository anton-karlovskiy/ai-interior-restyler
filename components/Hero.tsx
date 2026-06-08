export default function Hero() {
  return (
    <header className="px-8 pt-16 pb-10 md:pt-24 md:pb-14 max-w-7xl mx-auto w-full">
      <div className="max-w-xl">
        <p
          className="font-body text-xs tracking-[0.2em] uppercase text-muted mb-5"
          style={{ letterSpacing: "0.18em" }}
        >
          AI Interior Restyler
        </p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-text mb-5">
          Your room,
          <br />
          <span className="text-accent italic">reimagined.</span>
        </h1>
        <p className="font-body text-muted text-base md:text-lg leading-relaxed max-w-sm">
          Upload a room photo, pick a style, and watch it transform - same walls, new world.
        </p>
      </div>
    </header>
  );
}
