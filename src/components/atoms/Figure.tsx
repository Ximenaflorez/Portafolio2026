type Props = {
  src: string;
  /** Obligatorio: qué se ve y qué conclusión muestra (FR-016). */
  alt: string;
  caption: string;
  /** Dimensiones reales del archivo, para reservar espacio y evitar saltos de diseño. */
  width?: number;
  height?: number;
  className?: string;
};

export function Figure({ src, alt, caption, width, height, className = "" }: Props) {
  if (alt.trim() === "") {
    throw new Error(`Figure: falta el texto alternativo (alt) de ${src}`);
  }
  return (
    <figure className={`mt-4 ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full border border-border"
      />
      <figcaption className="mt-1 text-sm text-text-muted">{caption}</figcaption>
    </figure>
  );
}
