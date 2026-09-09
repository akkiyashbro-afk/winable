import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { caseFormSchema, type CaseFormInput } from "@/lib/validation";
import { submitCaseFn } from "./submitCase";
import { Reveal } from "./Reveal";

const steps = ["Case Intake", "Review", "Done"] as const;

const platforms = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "TikTok",
  "YouTube",
  "X (Twitter)",
  "Telegram",
  "Reddit",
  "Discord",
  "Other",
] as const;

const caseTypes = [
  "Disabled / Suspended Account",
  "Hacked / Compromised Account",
  "Impersonation",
  "Copyright / Content Issue",
  "Other / Not Listed?",
] as const;

const MAX_FILES = 4;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function PlatformIcon({ name }: { name: string }) {
  const cls = "size-4 fill-current";
  switch (name) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "X (Twitter)":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "Telegram":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    case "Reddit":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z" />
        </svg>
      );
    case "Discord":
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls}>
          <path d="M13.828 10.172a4-4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function CaseForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; caseId?: string; error?: string } | null>(
    null,
  );
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<CaseFormInput>({
    resolver: zodResolver(caseFormSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      platform: "Instagram",
      otherPlatform: "",
      caseType: "Disabled / Suspended Account",
      username: "",
      followers: "",
      alreadySubmittedAppeal: "no",
      canStillLogin: "no",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const watched = watch();

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const selected = Array.from(e.target.files || []);
    const valid: File[] = [];

    for (const file of selected) {
      if (valid.length >= MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed.`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError(`"${file.name}" is not a supported format. Use JPG, PNG, or PDF.`);
        break;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        break;
      }
      valid.push(file);
    }

    setFiles((prev) => {
      const combined = [...prev, ...valid].slice(0, MAX_FILES);
      return combined;
    });

    if (fileRef.current) fileRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  }

  const submitCase = useServerFn(submitCaseFn);

  async function onSubmit(data: CaseFormInput) {
    setSubmitting(true);
    try {
      const result = await submitCase({
        data: {
          fullName: data.fullName,
          email: data.email,
          platform: data.platform || "",
          otherPlatform: data.otherPlatform || "",
          caseType: data.caseType || "",
          username: data.username || "",
          followers: data.followers || "",
          alreadySubmittedAppeal: data.alreadySubmittedAppeal || "",
          canStillLogin: data.canStillLogin || "",
          description: data.description,
        },
      });

      const json = result;
      setResult(json);
      if (json.ok) setStep(2);
    } catch {
      setResult({ ok: false, error: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="case-form" className="shell py-28 md:py-40">
      <div className="mx-auto" style={{ maxWidth: "960px" }}>
        {/* Page Header */}
        <Reveal variant="left">
          <p className="eyebrow">Start a Case</p>
          <h2 className="display mt-7 text-[clamp(2.2rem,5vw,3.8rem)]">
            Tell Us What <span className="italic text-gold">Happened.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50">
            Fill in the details below. We&apos;ll review your case and get back to you with next
            steps.
          </p>
        </Reveal>

        {/* Progress Timeline */}
        <Reveal delay={100}>
          <div className="mt-12 mb-10">
            <div className="flex items-start gap-0">
              {steps.map((s, i) => {
                const isCompleted = i < step;
                const isActive = i === step;
                return (
                  <div key={s} className="flex items-start flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      {/* Number circle */}
                      <div
                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
                          isCompleted
                            ? "bg-gold text-black"
                            : isActive
                              ? "bg-gold/15 text-gold ring-2 ring-gold/40"
                              : "bg-white/[0.06] text-white/30"
                        }`}
                      >
                        {isCompleted ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          `0${i + 1}`
                        )}
                      </div>
                      {/* Label */}
                      <span
                        className={`mt-2.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${
                          isCompleted ? "text-gold" : isActive ? "text-foreground" : "text-white/30"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    {/* Connecting line */}
                    {i < steps.length - 1 && (
                      <div className="flex-1 flex items-center px-3 pt-3">
                        <div
                          className={`h-px w-full transition-colors duration-500 ${
                            isCompleted ? "bg-gold/50" : "bg-white/[0.08]"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Form Container */}
        <div className="rounded-lg border border-white/[0.08] bg-surface/40 p-7 md:p-9">
          {/* ====== STEP 1: CASE INTAKE ====== */}
          {step === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(() => next())();
              }}
            >
              {/* Section 01 — Your Details */}
              <Reveal variant="left">
                <SectionHeader number="01" title="Your Details" />
                <div className="grid gap-5 sm:grid-cols-2 mt-7">
                  <Field label="Full Name *" error={errors.fullName?.message}>
                    <input {...register("fullName")} placeholder="John Doe" className={inputClass} />
                  </Field>
                  <Field label="Email Address *" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Reveal>

              {/* Section 02 — Platform */}
              <Reveal delay={60}>
                <div className="mt-10">
                  <SectionHeader number="02" title="Platform" />
                  <div className="grid grid-cols-2 gap-2.5 mt-7 sm:grid-cols-3 lg:grid-cols-5">
                    {platforms.map((p) => (
                      <label
                        key={p}
                        className={`group relative flex items-center gap-3 rounded-md border px-3.5 py-3 cursor-pointer transition-all duration-200 ${
                          watched.platform === p
                            ? "border-gold/40 bg-gold/[0.06] text-foreground"
                            : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/[0.15] hover:bg-white/[0.04]"
                        }`}
                      >
                        <input type="radio" value={p} {...register("platform")} className="sr-only" />
                        <span className={`transition-colors duration-200 ${
                          watched.platform === p ? "text-gold" : "text-white/25 group-hover:text-white/45"
                        }`}>
                          <PlatformIcon name={p} />
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            watched.platform === p ? "text-foreground" : "text-white/50 group-hover:text-white/70"
                          }`}
                        >
                          {p}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.platform && (
                    <p className="mt-2.5 text-xs text-red-400">{errors.platform.message}</p>
                  )}
                  {watched.platform === "Other" && (
                    <div className="mt-5">
                      <Field label="Specify Platform" error={errors.otherPlatform?.message}>
                        <input
                          {...register("otherPlatform")}
                          placeholder="Platform name"
                          className={inputClass}
                        />
                      </Field>
                      <p className="mt-2 text-xs text-white/35 italic">
                        Tell Me What Happened → Get a Custom Quote
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Section 03 — Case Details */}
              <Reveal delay={120}>
                <div className="mt-10">
                  <SectionHeader number="03" title="Case Details" />
                  <div className="mt-7 space-y-2">
                    {caseTypes.map((c) => (
                      <label
                        key={c}
                        className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-md border cursor-pointer transition-all duration-200 ${
                          watched.caseType === c
                            ? "border-gold/30 bg-gold/[0.05] text-foreground"
                            : "border-white/[0.06] bg-transparent text-white/45 hover:border-white/[0.12] hover:bg-white/[0.02]"
                        }`}
                      >
                        <input type="radio" value={c} {...register("caseType")} className="sr-only" />
                        <span
                          className={`size-2 rounded-full transition-colors duration-200 ${
                            watched.caseType === c ? "bg-gold" : "bg-white/15"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium transition-colors duration-200 ${
                            watched.caseType === c ? "text-foreground" : "text-white/45 group-hover:text-white/65"
                          }`}
                        >
                          {c}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.caseType && (
                    <p className="mt-2.5 text-xs text-red-400">{errors.caseType.message}</p>
                  )}
                  {watched.caseType === "Other / Not Listed?" && (
                    <p className="mt-2 text-xs text-white/35 italic">
                      Tell Me How I Can Help → Get a Custom Quote
                    </p>
                  )}

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Field label="Username" error={errors.username?.message}>
                      <input
                        {...register("username")}
                        placeholder="@username"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Followers Count" error={errors.followers?.message}>
                      <input
                        {...register("followers")}
                        placeholder="e.g. 128K"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Already submitted an appeal?" error={errors.alreadySubmittedAppeal?.message}>
                      <select {...register("alreadySubmittedAppeal")} className={inputClass}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </Field>
                    <Field label="Can you still log in?" error={errors.canStillLogin?.message}>
                      <select {...register("canStillLogin")} className={inputClass}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-8">
                    <Field label="Description *" error={errors.description?.message}>
                      <textarea
                        {...register("description")}
                        rows={7}
                        placeholder="Tell me what happened, when the issue started, and what you've already tried..."
                        className={`${inputClass} resize-none`}
                      />
                      <p className="mt-2 text-xs text-white/30 italic">
                        Don&apos;t Take Help From Any AI, Write Down Your Own
                      </p>
                    </Field>
                  </div>

                  <div className="mt-8">
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Attach supporting evidence
                    </label>
                    <p className="mb-3 text-xs text-white/30">JPG, PNG or PDF · Up to 4 files · 5MB each</p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2.5 rounded-md border border-dashed border-white/[0.12] bg-white/[0.02] px-5 py-4 text-sm text-white/45 transition-all hover:border-white/[0.22] hover:bg-white/[0.04] hover:text-white/65"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4.5 shrink-0">
                        <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                      </svg>
                      {files.length > 0 ? `${files.length} file(s) attached` : "Choose files"}
                    </button>
                    {fileError && <p className="mt-2 text-xs text-red-400">{fileError}</p>}
                    {files.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {files.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs text-white/40"
                          >
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="ml-4 text-white/25 hover:text-red-400 shrink-0 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* CTA */}
              <Reveal delay={160}>
                <div className="mt-10 pt-8 border-t border-white/[0.08]">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-gold px-8 py-4 text-sm font-semibold text-black transition-colors hover:brightness-110"
                  >
                    Continue to Review →
                  </button>
                </div>
              </Reveal>
            </form>
          )}

          {/* ====== STEP 2: REVIEW ====== */}
          {step === 1 && (
            <Reveal variant="scale">
              <h3 className="display text-2xl mb-8">Review Your Case</h3>
              <div className="divide-y divide-white/[0.08] text-sm">
                <SummaryRow label="Name" value={watched.fullName} />
                <SummaryRow label="Email" value={watched.email} />
                <SummaryRow label="Platform" value={watched.platform === "Other" ? `Other — ${watched.otherPlatform}` : watched.platform} />
                <SummaryRow label="Case Type" value={watched.caseType} />
                <SummaryRow label="Username" value={watched.username || "—"} />
                <SummaryRow label="Followers" value={watched.followers || "—"} />
                <SummaryRow label="Appeal Submitted" value={watched.alreadySubmittedAppeal || "—"} />
                <SummaryRow label="Can Login" value={watched.canStillLogin || "—"} />
                <SummaryRow label="Description" value={watched.description} />
                {files.length > 0 && (
                  <SummaryRow label="Attachments" value={files.map((f) => f.name).join(", ")} />
                )}
              </div>

              {result && !result.ok && (
                <div className="mt-6 rounded-md border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                  {result.error || "Something went wrong. Please try again."}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-white/[0.08] flex gap-4">
                <button
                  type="button"
                  onClick={prev}
                  className="flex-1 rounded-md border border-white/[0.12] px-6 py-4 text-sm font-medium text-white/55 transition-colors hover:text-foreground hover:border-white/[0.22]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="flex-1 rounded-md bg-gold px-6 py-4 text-sm font-semibold text-black transition-colors hover:brightness-110 disabled:opacity-40"
                >
                  {submitting ? "Submitting..." : "Submit Case"}
                </button>
              </div>
            </Reveal>
          )}

          {/* ====== STEP 3: DONE ====== */}
          {step === 2 && (
            <Reveal variant="scale">
              <div className="py-12 text-center">
                <div className="mx-auto mb-8 flex size-14 items-center justify-center rounded-full border-2 border-gold/25">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-7 text-gold">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="display text-3xl">Case Submitted Successfully</h3>
                <p className="mt-4 text-base text-white/45">Your case reference number is:</p>
                <p className="mt-3 font-mono text-xl font-semibold text-gold tracking-widest">
                  {result?.caseId}
                </p>
                <p className="mt-5 text-sm text-white/45 max-w-md mx-auto leading-relaxed">
                  We&apos;ve sent a confirmation email with your case details. We&apos;ll review
                  your case and get back to you within 24-48 hours.
                </p>
                <p className="mt-6 text-xs text-white/30">
                  Save this reference number for your records.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs font-bold tracking-[0.16em] text-gold">{number}</span>
      <h3 className="text-sm font-semibold tracking-wide text-white/70">{title}</h3>
      <span className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex justify-between gap-4 py-4 px-2">
      <span className="text-white/40 shrink-0 text-sm">{label}</span>
      <span className="text-white/75 text-right text-sm leading-relaxed">{value || "—"}</span>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-white/30 outline-none transition-colors focus:border-gold/40 focus:bg-white/[0.06]";
