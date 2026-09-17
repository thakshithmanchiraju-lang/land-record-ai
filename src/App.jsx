import React, { useState } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_URL = 'https://land-record-ocr-backend.onrender.com/api/ocr';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setData(null);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakSummary = () => {
    if (!data || !data.fields) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const { doc_type, owner_name, survey_number, extent_area, location, verification, languages } = data.fields;
    const detectedLang = languages && languages.length > 0 ? languages[0] : 'English';

    let langCode = 'en-IN';
    if (detectedLang === 'Telugu') langCode = 'te-IN';
    else if (detectedLang === 'Hindi') langCode = 'hi-IN';
    else if (detectedLang === 'Tamil') langCode = 'ta-IN';
    else if (detectedLang === 'Malayalam') langCode = 'ml-IN';

    const textToSpeak = `Document Type: ${doc_type}. Owner Name: ${owner_name}. Survey Number: ${survey_number}. Area: ${extent_area}. Location: ${location}. Document status is ${verification?.status}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'VERIFIED_GENUINE':
        return { bg: '#064e3b', text: '#34d399', border: '#059669', label: 'Verified Genuine' };
      case 'REQUIRES_AUDIT':
        return { bg: '#78350f', text: '#fcd34d', border: '#d97706', label: 'Requires Manual Audit' };
      default:
        return { bg: '#7f1d1d', text: '#fca5a5', border: '#dc2626', label: 'Unverified Record' };
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Land Record AI Digitization & Authenticator</h1>
        <p style={styles.subtitle}>
          Multi-Script OCR • Voice Summarizer • Telugu | English | Hindi | Tamil | Malayalam
        </p>
      </header>

      <main style={styles.main}>
        {/* Upload Card */}
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
              {selectedFile ? 'Change File' : 'Choose Document Image'}
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
              {loading ? 'Processing Multilingual OCR...' : 'Digitize & Verify Document'}
            </button>
            {selectedFile && (
              <button onClick={resetAll} style={styles.resetButton}>
                Reset
              </button>
            )}
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {/* Results Card */}
        {data && data.fields && (
          <div style={styles.card}>
            <div style={styles.resultHeader}>
              <h2 style={styles.cardTitle}>2. Extraction & Verification Summary</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={speakSummary} style={styles.voiceButton}>
                  {isSpeaking ? '⏹ Stop Voice Summary' : '🔊 Listen Voice Summary'}
                </button>
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
            </div>

            {/* Verification Message */}
            {data.fields.verification && (
              <div style={styles.verificationCard}>
                <strong>Source:</strong> {data.fields.verification.registry_source}
                <p style={{ margin: '4px 0 0 0' }}>{data.fields.verification.message}</p>
              </div>
            )}

            {/* Extracted Fields Grid */}
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
                <span style={{ ...styles.fieldValue, color: '#38bdf8' }}>
                  {data.fields.languages ? data.fields.languages.join(', ') : 'English'}
                </span>
              </div>
            </div>

            {/* Raw Text Toggle */}
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setShowRawText(!showRawText)} style={styles.toggleButton}>
                {showRawText ? 'Hide Raw Text' : 'View Raw Extracted Text'}
              </button>

              {showRawText && (
                <textarea readOnly value={data.raw_text} rows={8} style={styles.rawTextArea} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Dark Slate Theme Inline Styles
const styles = {
  container: {
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    padding: '24px',
    color: '#f8fafc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
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
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f1f5f9',
    margin: '0 0 16px 0',
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
    fontWeight: '600',
    display: 'inline-block',
  },
  fileName: {
    fontSize: '14px',
    color: '#cbd5e1',
  },
  previewContainer: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  previewImage: {
    maxHeight: '260px',
    maxWidth: '100%',
    borderRadius: '6px',
    border: '1px solid #475569',
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
    backgroundColor: '#64748b',
    color: '#ffffff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorBox: {
    marginTop: '12px',
    backgroundColor: '#450a0a',
    color: '#fca5a5',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #991b1b',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  voiceButton: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid',
  },
  verificationCard: {
    backgroundColor: '#0f172a',
    borderLeft: '4px solid #3b82f6',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#e2e8f0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '12px',
  },
  fieldBox: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: '2px',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: '1px solid #475569',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#cbd5e1',
  },
  rawTextArea: {
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #334155',
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: '#0f172a',
    color: '#cbd5e1',
    boxSizing: 'border-box',
  },
};