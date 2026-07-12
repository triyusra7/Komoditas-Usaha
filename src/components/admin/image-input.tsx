"use client";

const MAX_SIZE_MB = 3;

type ImageInputProps = {
  name: string;
  max: number;
  helpText?: string;
};

/** Multi-file image input with client-side count and size validation. */
export function ImageInput({ name, max, helpText }: ImageInputProps) {
  function validate(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const files = [...(input.files ?? [])];
    if (files.length > max) {
      input.setCustomValidity(`Maksimal ${max} gambar.`);
    } else if (files.some((file) => file.size > MAX_SIZE_MB * 1024 * 1024)) {
      input.setCustomValidity(`Ukuran tiap gambar maksimal ${MAX_SIZE_MB} MB.`);
    } else {
      input.setCustomValidity("");
    }
    input.reportValidity();
  }

  return (
    <div>
      <input
        type="file"
        name={name}
        multiple={max > 1}
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={validate}
        className="adm-input cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-bold file:text-secondary"
      />
      <p className="mt-1 text-xs text-muted-foreground">
        {helpText ?? `Maksimal ${max} gambar, JPG/PNG/WebP, ≤ ${MAX_SIZE_MB} MB per file.`}
      </p>
    </div>
  );
}
