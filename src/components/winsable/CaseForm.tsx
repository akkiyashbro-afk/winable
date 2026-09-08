import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { caseFormSchema, type CaseFormInput } from "@/lib/validation";
import { submitCaseFn } from "./submitCase";
import { Reveal } from "./Reveal";

const steps = ["Details", "Platform", "Case", "Review", "Done"] as const;

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
      if (json.ok) setStep(4);
    } catch {
      setResult({ ok: false, error: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="case-form" className="shell py-24 md:py-36">
      <div className="mx-auto max-w-2xl">
        <Reveal variant="left">
          <p className="eyebrow">Start a Case</p>
          <h2 className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">
            Tell Us What <span className="italic text-gold">Happened.</span>
          </h2>
          <p className="mt-4 text-white/50">
            Fill in the details below. We&apos;ll review your case and get back to you with next
            steps.
          </p>
        </Reveal>

        {/* Progress */}
        <Reveal delay={100}>
          <div className="mt-10 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`grid size-8 place-items-center rounded-full text-xs font-bold transition-all duration-300 ${
                    i < step
                      ? "bg-gold text-black"
                      : i === step
                        ? "bg-gold/20 text-gold ring-1 ring-gold/40"
                        : "bg-white/[0.06] text-white/30"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px w-8 transition-colors duration-300 ${i < step ? "bg-gold" : "bg-white/[0.06]"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </Reveal>

        {/* Form Steps */}
        <div className="mt-8 glass rounded-2xl p-6 md:p-8">
          {step === 0 && (
            <Reveal variant="left">
              <h3 className="text-lg font-semibold mb-6">Your Details</h3>
              <div className="space-y-4">
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
              <NavButtons onNext={next} />
            </Reveal>
          )}

          {step === 1 && (
            <Reveal variant="right">
              <h3 className="text-lg font-semibold mb-6">Platform</h3>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((p) => (
                  <label
                    key={p}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      watched.platform === p
                        ? "border-gold bg-gold/[0.06] text-gold"
                        : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <input type="radio" value={p} {...register("platform")} className="sr-only" />
                    <span
                      className={`grid size-5 place-items-center rounded-full border ${
                        watched.platform === p ? "border-gold bg-gold" : "border-white/20"
                      }`}
                    >
                      {watched.platform === p && <span className="size-2 rounded-full bg-black" />}
                    </span>
                    {p}
                  </label>
                ))}
              </div>
              {errors.platform && (
                <p className="mt-2 text-xs text-red-400">{errors.platform.message}</p>
              )}
              {watched.platform === "Other" && (
                <Field label="Specify Platform" error={errors.otherPlatform?.message}>
                  <input
                    {...register("otherPlatform")}
                    placeholder="Platform name"
                    className={inputClass}
                  />
                </Field>
              )}
              {watched.platform === "Other" && (
                <p className="mt-2 text-xs text-gold/60">
                  Tell Me What Happened → Get a Custom Quote
                </p>
              )}
              <NavButtons onPrev={prev} onNext={next} />
            </Reveal>
          )}

          {step === 2 && (
            <Reveal variant="left">
              <h3 className="text-lg font-semibold mb-6">Case Details</h3>
              <div className="space-y-4">
                <Field label="Case Type *" error={errors.caseType?.message}>
                  <select {...register("caseType")} className={inputClass}>
                    <option value="">Select the issue you&apos;re facing</option>
                    {caseTypes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                {watched.caseType === "Other / Not Listed?" && (
                  <p className="text-xs text-gold/60">
                    Tell Me How I Can Help → Get a Custom Quote
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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
                <Field label="Description *" error={errors.description?.message}>
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Tell me what happened, when the issue started, and what you've already tried..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-xs text-white/30 italic">
                    Don&apos;t Take Help From Any AI, Write Down Your Own
                  </p>
                </Field>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Screenshot Of Problem (max 4)
                  </label>
                  <p className="mb-2 text-xs text-white/40">JPG, PNG or PDF • 5MB each</p>
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
                    className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/50 transition-colors hover:border-gold/40 hover:text-white/70"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                      <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    {files.length > 0 ? `${files.length} file(s) selected` : "Choose files"}
                  </button>
                  {fileError && <p className="mt-1 text-xs text-red-400">{fileError}</p>}
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs text-white/40"
                        >
                          <span className="truncate">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="ml-2 text-red-400 hover:text-red-300 shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <NavButtons onPrev={prev} onNext={next} />
            </Reveal>
          )}

          {step === 3 && (
            <Reveal variant="scale">
              <h3 className="text-lg font-semibold mb-6">Review Your Case</h3>
              <div className="space-y-3 text-sm">
                <SummaryRow label="Name" value={watched.fullName} />
                <SummaryRow label="Email" value={watched.email} />
                <SummaryRow label="Platform" value={watched.platform} />
                <SummaryRow label="Case Type" value={watched.caseType} />
                <SummaryRow label="Username" value={watched.username || "N/A"} />
                <SummaryRow label="Followers" value={watched.followers || "N/A"} />
                <SummaryRow label="Appeal Submitted" value={watched.alreadySubmittedAppeal || "N/A"} />
                <SummaryRow label="Can Login" value={watched.canStillLogin || "N/A"} />
                <SummaryRow label="Description" value={watched.description} />
                {files.length > 0 && (
                  <SummaryRow label="Attachments" value={files.map((f) => f.name).join(", ")} />
                )}
              </div>

              {result && !result.ok && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {result.error || "Something went wrong. Please try again."}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/[0.08]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Case"}
                </button>
              </div>
            </Reveal>
          )}

          {step === 4 && (
            <Reveal variant="scale">
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-gold/10">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-8 text-gold">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Case Submitted Successfully</h3>
                <p className="mt-2 text-white/50">Your case reference number is:</p>
                <p className="mt-3 text-2xl font-bold text-gold tracking-widest">
                  {result?.caseId}
                </p>
                <p className="mt-4 text-sm text-white/40 max-w-md mx-auto">
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
      <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function NavButtons({ onPrev, onNext }: { onPrev?: () => void; onNext: () => void }) {
  return (
    <div className="mt-8 flex gap-3">
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/[0.08]"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex-1 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-black transition-all hover:brightness-110"
      >
        Continue →
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex justify-between gap-4 rounded-lg bg-white/[0.03] px-4 py-2.5">
      <span className="text-white/40 shrink-0">{label}</span>
      <span className="text-white/80 text-right truncate">{value || "N/A"}</span>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold/40 focus:bg-white/[0.06]";
