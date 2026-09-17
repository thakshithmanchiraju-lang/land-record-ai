import React, { useState } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);

  const API_URL = 'https://land-record-ocr-backend.onrender.com/api/ocr';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setData(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a land record document image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setData(result);
      } else {
        throw new Error(result.detail || 'Failed to process document');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to OCR backend server.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setData(null);
    setError(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'VERIFIED_GENUINE':
        return { bg: '#d1fae5', text: '#065f46', border: '#34d399', label: 'Verified Genuine' };
      case 'REQUIRES_AUDIT':
        return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'Requires Manual Audit' };
      default:
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: 'Unverified Record' };
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Land Record AI Digitization & Authenticator</h1>
        <p style={styles.subtitle}>SIH26018 • Multi-Script OCR & Revenue Document Authenticator</p>
      </header>

      <main style={styles.main}>
        {/* Upload Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>1. Upload Document Image</h2>
          <div style={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" style={styles.uploadButton}>
              {selectedFile ? 'Change File' : 'Choose Document (JPG, PNG)'}
            </label>
            {selectedFile && <span style={styles.fileName}>{selectedFile.name}</span>}
          </div>

          {previewUrl && (
            <div style={styles.previewContainer}>
              <img src={previewUrl} alt="Document Preview" style={styles.previewImage} />
            </div>
          )}

          <div style={styles.actionRow}>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              style={{
                ...styles.submitButton,
                opacity: !selectedFile || loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Processing OCR & Verifying...' : 'Digitize & Verify Document'}
            </button>
            {selectedFile && (
              <button onClick={resetAll} style={styles.resetButton}>
                Reset
              </button>
            )}
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {/* Results Section */}
        {data && data.fields && (
          <div style={styles.card}>
            <div style={styles.resultHeader}>
              <h2 style={styles.cardTitle}>2. Extraction & Verification Summary</h2>
              {data.fields.verification && (
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getStatusBadgeClass(data.fields.verification.status).bg,
                    color: getStatusBadgeClass(data.fields.verification.status).text,
                    borderColor: getStatusBadgeClass(data.fields.verification.status).border,
                  }}
                >
                  {getStatusBadgeClass(data.fields.verification.status).label} (
                  {data.fields.verification.confidence_score})
                </span>
              )}
            </div>

            {/* Verification Message */}
            {data.fields.verification && (
              <div style={styles.verificationCard}>
                <strong>Source:</strong> {data.fields.verification.registry_source}
                <p style={{ margin: '4px 0 0 0' }}>{data.fields.verification.message}</p>
              </div>
            )}

            {/* Parsed Fields Grid */}
            <div style={styles.grid}>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Document Type</span>
                <span style={styles.fieldValue}>{data.fields.doc_type}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Stamp / GRN / Reg No.</span>
                <span style={styles.fieldValue}>{data.fields.stamp_number}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>First Party / Seller</span>
                <span style={styles.fieldValue}>{data.fields.owner_name}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Second Party / Purchaser</span>
                <span style={styles.fieldValue}>{data.fields.purchaser_name}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Survey / Khasra / Plot No.</span>
                <span style={styles.fieldValue}>{data.fields.survey_number}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Extent / Area</span>
                <span style={styles.fieldValue}>{data.fields.extent_area}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Execution Date</span>
                <span style={styles.fieldValue}>{data.fields.execution_date}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Stamp Value</span>
                <span style={styles.fieldValue}>{data.fields.stamp_value}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Location</span>
                <span style={styles.fieldValue}>{data.fields.location}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>Detected Languages</span>
                <span style={styles.fieldValue}>
                  {data.fields.languages ? data.fields.languages.join(', ') : 'English'}
                </span>
              </div>
            </div>

            {/* Raw OCR Text Toggle */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setShowRawText(!showRawText)}
                style={styles.toggleButton}
              >
                {showRawText ? 'Hide Raw OCR Text' : 'View Raw Extracted Text'}
              </button>

              {showRawText && (
                <textarea
                  readOnly
                  value={data.raw_text}
                  rows={8}
                  style={styles.rawTextArea}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    padding: '24px',
    color: '#1f2937',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  main: {
    maxWidth: '850px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    margin: 0,
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-block',
  },
  fileName: {
    fontSize: '14px',
    color: '#374151',
  },
  previewContainer: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  previewImage: {
    maxHeight: '260px',
    maxWidth: '100%',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorBox: {
    marginTop: '12px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid',
  },
  verificationCard: {
    backgroundColor: '#f8fafc',
    borderLeft: '4px solid #2563eb',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '12px',
  },
  fieldBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '6px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginTop: '2px',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
  },
  rawTextArea: {
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
  },
};