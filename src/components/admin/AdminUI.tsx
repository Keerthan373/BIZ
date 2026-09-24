import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminLoading() {
  return (
    <div className="admin-loading">
      <Loader2 className="animate-spin" size={32} />
      <p>Loading…</p>
    </div>
  );
}

export function AdminSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <span className="admin-section-label">{label}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ImagePreview({
  src,
  alt,
  onRemove,
}: {
  src: string;
  alt: string;
  onRemove?: () => void;
}) {
  return (
    <div className="admin-image-preview">
      <img src={src} alt={alt} />
      {onRemove && (
        <button type="button" className="admin-image-remove" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export function AdminTextInput({
  label,
  value,
  onChange,
  placeholder,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">
        {label}
        {optional && <em>optional</em>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function AdminTextArea({
  label,
  value,
  onChange,
  placeholder,
  optional,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: boolean;
  rows?: number;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">
        {label}
        {optional && <em>optional</em>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

export function AdminUploadButton({
  onFile,
  accept = 'image/jpeg,image/png,image/webp',
  children,
}: {
  onFile: (file: File) => void;
  accept?: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-upload-btn">
      {children}
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
    </label>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className={`admin-btn admin-btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
