import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  portfolioMediaSources,
  PORTFOLIO_MEDIA_WIDTHS,
  type PortfolioMedia,
  type PortfolioProject,
} from "@/lib/portfolio.mjs";

function PortfolioMediaElement({ media }: { media: PortfolioMedia }) {
  return media.kind === "image" ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="w-full" src={media.src} alt={media.alt} />
  ) : <video className="w-full" src={media.src} poster={media.posterSrc} controls preload="metadata" />;
}

function PortfolioInlineMedia({ media }: { media: PortfolioMedia }) {
  return (
    <span
      className="my-8 block"
      style={{ width: PORTFOLIO_MEDIA_WIDTHS[media.size], marginInline: "auto" }}
    >
      <PortfolioMediaElement media={media} />
      <span className="text-subtext mt-2 block text-sm">{media.caption}</span>
    </span>
  );
}

function PortfolioMediaFigure({ media }: { media: PortfolioMedia }) {
  return (
    <figure>
      <PortfolioMediaElement media={media} />
      <figcaption className="text-subtext text-sm mt-2">{media.caption}</figcaption>
    </figure>
  );
}

export default function PortfolioProjectArticle({ project }: { project: PortfolioProject }) {
  const mediaBySrc = new Map(project.media.map((media) => [media.src, media]));
  const inlineSources = new Set(portfolioMediaSources(project.descriptionMarkdown));
  const trailingMedia = project.media.filter(({ src }) => !inlineSources.has(src));
  const mdxComponents = {
    img({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
      const media = typeof src === "string" ? mediaBySrc.get(src) : undefined;
      if (media) return <PortfolioInlineMedia media={media} />;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt ?? ""} {...props} />;
    },
  };

  return (
    <article className="article-shell">
      <header className="mb-12">
        <p className="text-subtext text-sm mb-2">{project.period}</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold">{project.name}</h1>
      </header>
      <div className="prose">
        <MDXRemote source={project.descriptionMarkdown} components={mdxComponents} />
      </div>
      {trailingMedia.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {trailingMedia.map((media, index) => (
            <PortfolioMediaFigure key={`${media.src}-${index}`} media={media} />
          ))}
        </div>
      )}
    </article>
  );
}
