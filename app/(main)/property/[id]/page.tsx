import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageCarousel from "./ImageCarousel";
import BrochureButton from "./BrochureButton";

// ── Types ────────────────────────────────────────────────────
interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

// ── Shared sub-components ─────────────────────────────────────
function SectionDivider() {
  return <div className="h-px bg-white/5" />;
}

function SectionLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2">
      {icon}
      {children}
    </h2>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default async function PropertyDetails({ params }: PropertyPageProps) {
  const { id } = await params;
  if (!id) notFound();

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the project: ${property.projectName} located at ${property.location}. Can you share more details?`
  );

  const keyDetails = [
    { label: "Project Area",  value: property.projectArea },
    { label: "Configuration", value: property.configuration },
    { label: "Floors",        value: `${property.floors} Floors` },
    { label: "Towers",        value: `${property.towers} Towers` },
    { label: "Possession",    value: property.possessionDate },
    { label: "Pricing From",  value: property.pricingStartsFrom, highlight: true },
  ];


  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ─── Top accent bar ── */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />

      {/* ─── Ambient background ── */}
      <div className="relative overflow-hidden">

        {/* Background layers */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundImage: `url(${property.images?.[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/85 to-gray-950 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />

        {/* ─── Page content ── */}
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-10 font-medium tracking-wide">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <span className="text-gray-700">›</span>
            <a href="/trending" className="hover:text-amber-400 transition-colors">Properties</a>
            <span className="text-gray-700">›</span>
            <span className="text-gray-300 truncate max-w-[200px]">{property.projectName}</span>
          </nav>

          {/* Image carousel */}
          <ImageCarousel images={property.images} />

          {/* ─── Main layout: content + sidebar ── */}
          <div className="grid md:grid-cols-3 gap-10 mt-8">

            {/* ── Left column: property details ── */}
            <div className="md:col-span-2 space-y-7">

{/* Badges */}
<div className="flex items-center gap-3 flex-wrap">
  {property.isTrending && (
    <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">
      🔥 Trending Property
    </span>
  )}
  {property.isReadyToMove && (
    <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">
      ✓ Ready to Move
    </span>
  )}
  {property.isUnderConstruction && (
    <span className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full">
      🏗 Under Construction
    </span>
  )}
  {property.isNewLaunch && (
    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
      🚀 New Launch
    </span>
  )}
    {property.isEarlypossesion && (
    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
      🌏 Early Possesion
    </span>
  )}
  <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-400 text-xs font-mono px-3 py-1.5 rounded-full">
    Rera No.: {property.propoyeId}
  </span>
</div>

              {/* Title + location */}
              <div className="space-y-1">
                <h1
                  className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {property.projectName}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {property.location}
                </div>
                <p className="text-gray-500 text-xs pl-6">{property.address}</p>
              </div>

              {/* Key details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {keyDetails.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl px-4 py-3 border ${
                      item.highlight
                        ? "bg-amber-400/10 border-amber-400/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">
                      {item.label}
                    </div>
                    <div className={`text-sm font-bold ${item.highlight ? "text-amber-400" : "text-white"}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <SectionDivider />



              {property.builderName?.trim() && (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Builder</div>
    <div className="text-sm font-bold text-white ml-auto">{property.builderName}</div>
  </div>
)}


              {/* Floor Plans */}
              {property.floorPlans && property.floorPlans.length > 0 && (
                <>
                  <SectionDivider />
                  <div>
                    <SectionLabel>Floor Plans</SectionLabel>
                    <ImageCarousel images={property.floorPlans} />
                  </div>
                </>
              )}

              {/* Description */}
              {property.description?.trim() && (
                <>
                  <SectionDivider />
                  <div>
                    <SectionLabel
                      icon={
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                        </svg>
                      }
                    >
                      About This Property
                    </SectionLabel>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {property.description}
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* ── Right column: action sidebar ── */}
            <aside className="md:col-span-1">
              <div className="sticky top-28 bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* Accent bar */}
                <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-300" />

                <div className="p-6 space-y-4">

                  {/* Pricing */}
                  <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl px-4 py-3 text-center">
                    <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">
                      Starting From
                    </div>
                    <div
                      className="text-xl font-extrabold text-amber-400"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {property.pricingStartsFrom}
                    </div>
                  </div>

                  <SectionDivider />

                  {/* CTA copy */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-1">Interested?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Get in touch for more details, pricing, and site visits.
                    </p>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/919702162636?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] shadow-md text-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Enquire on WhatsApp
                  </a>

                  {/* Brochure button */}
                  <BrochureButton
                    projectName={property.projectName}
                    location={property.location}
                  />

                  <p className="text-center text-[10px] text-gray-600 pt-1">
                    Our team typically responds within minutes
                  </p>

                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}