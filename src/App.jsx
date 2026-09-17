import React, { useState, useRef } from 'react';

const TRANSLATIONS = {
  Telugu: {
    title: 'భూ రికార్డు AI డిజిటైజేషన్',
    uploadTitle: '1. పత్రం చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా క్యాప్చర్ చేయండి',
    chooseFile: 'ఫైల్‌ను ఎంచుకోండి',
    capturePhoto: '📸 కెమెరా ఫోటో తీయండి',
    changeFile: 'ఫైల్‌ను మార్చండి',
    processBtn: 'డిజిటైజ్ & ధృవీకరించు',
    processing: 'బహుభాషా OCR ప్రాసెస్ చేయబడుతోంది...',
    resetBtn: 'రీసెట్',
    resultTitle: '2. సేకరించిన వివరాలు & ధృవీకరణ',
    listenVoice: '🔊 వాయిస్ వినండి',
    stopVoice: '⏹ ఆపు',
    exportJson: '📥 JSON ఎగుమతి',
    exportPdf: '📄 PDF నివేదిక',
    rawTextHide: 'ముడి టెక్స్ట్ దాచు',
    rawTextShow: 'ముడి బహుభాషా టెక్స్ట్ చూడండి',
    labels: {
      doc_type: 'పత్రం రకం',
      stamp_number: 'స్టాంప్ / రిజిస్ట్రేషన్ నం.',
      owner_name: 'మొదటి పార్టీ / యజమాని',
      purchaser_name: 'రెండవ పార్టీ / కొనుగోలుదారు',
      survey_number: 'సర్వే / ఖస్రా నంబర్',
      extent_area: 'విస్తీర్ణం / విస్తీర్ణ వైశాల్యం',
      execution_date: 'అమలు చేసిన తేదీ',
      stamp_value: 'స్టాంప్ విలువ',
      location: 'ప్రాంతం',
      languages: 'గుర్తించబడిన భాషలు'
    }
  },
  Hindi: {
    title: 'भूमि अभिलेख AI डिजिटलीकरण',
    uploadTitle: '1. दस्तावेज़ छवि अपलोड करें या कैप्चर करें',
    chooseFile: 'फ़ाइल चुनें',
    capturePhoto: '📸 कैमरा फोटो लें',
    changeFile: 'फ़ाइल बदलें',
    processBtn: 'डिजिटाइज़ और सत्यापित करें',
    processing: 'बहुभाषी ओसीआर संसाधित हो रहा है...',
    resetBtn: 'रीसेट',
    resultTitle: '2. निष्कर्षण और सत्यापन सारांश',
    listenVoice: '🔊 आवाज़ सुनें',
    stopVoice: '⏹ रोकें',
    exportJson: '📥 JSON निर्यात',
    exportPdf: '📄 PDF रिपोर्ट',
    rawTextHide: 'कच्चा पाठ छुपाएं',
    rawTextShow: 'कच्चा बहुभाषी पाठ देखें',
    labels: {
      doc_type: 'दस्तावेज़ का प्रकार',
      stamp_number: 'स्टाम्प / जीआरएन / पंजीकरण संख्या',
      owner_name: 'प्रथम पक्ष / विक्रेता',
      purchaser_name: 'द्वितीय पक्ष / क्रेता',
      survey_number: 'सर्वे / खसरा नंबर',
      extent_area: 'क्षेत्रफल / विस्तार',
      execution_date: 'निष्पादन तिथि',
      stamp_value: 'स्टाम्प मूल्य',
      location: 'स्थान',
      languages: 'पहचानी गई भाषाएं'
    }
  },
  Tamil: {
    title: 'நிலப் பதிவு AI டிஜிட்டல்மயமாக்கல்',
    uploadTitle: '1. ஆவணப் படத்தை பதிவேற்றவும் அல்லது பிடிக்கவும்',
    chooseFile: 'கோப்பைத் தேர்ந்தெடுக்கவும்',
    capturePhoto: '📸 கேமரா புகைப்படம்',
    changeFile: 'கோப்பை மாற்றவும்',
    processBtn: 'டிஜிட்டல் மற்றும் சரிபார்க்கவும்',
    processing: 'பன்மொழி OCR செயலாக்கப்படுகிறது...',
    resetBtn: 'மீட்டமை',
    resultTitle: '2. பிரித்தெடுத்தல் & சரிபார்ப்பு சுருக்கம்',
    listenVoice: '🔊 குரலைக் கேளுங்கள்',
    stopVoice: '⏹ நிறுத்து',
    exportJson: '📥 JSON ஏற்றுமதி',
    exportPdf: '📄 PDF அறிக்கை',
    rawTextHide: 'மூல உரையைக் மறை',
    rawTextShow: 'மூல பன்மொழி உரையைக் காட்டு',
    labels: {
      doc_type: 'ஆவண வகை',
      stamp_number: 'முத்திரை / பதிவு எண்',
      owner_name: 'முதல் தரப்பு / விற்பனையாளர்',
      purchaser_name: 'இரண்டாம் தரப்பு / வாங்குபவர்',
      survey_number: 'சர்வே எண்',
      extent_area: 'பரப்பளவு',
      execution_date: 'செயல்படுத்தப்பட்ட தேதி',
      stamp_value: 'முத்திரை மதிப்பு',
      location: 'இடம்',
      languages: 'கண்டறியப்பட்ட மொழிகள்'
    }
  },
  Malayalam: {
    title: 'ഭൂമി രേഖ AI ഡിജിറ്റൈസേഷൻ',
    uploadTitle: '1. രേഖയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുകയോ ക്യാപ്ചർ ചെയ്യുകയോ ചെയ്യുക',
    chooseFile: 'ഫയൽ തിരഞ്ഞെടുക്കുക',
    capturePhoto: '📸 ക്യാമറ ഫോട്ടോ',
    changeFile: 'ഫയൽ മാറ്റുക',
    processBtn: 'ഡിജിറ്റൈസ് ചെയ്ത് പരിശോധിക്കുക',
    processing: 'ഒസിആർ പ്രോസസ്സ് ചെയ്യുന്നു...',
    resetBtn: 'റീസെറ്റ്',
    resultTitle: '2. വിവരങ്ങളും സ്ഥിരീകരണവും',
    listenVoice: '🔊 ശബ്ദം കേൾക്കുക',
    stopVoice: '⏹ നിർത്തുക',
    exportJson: '📥 JSON കയറ്റുമതി',
    exportPdf: '📄 PDF റിപ്പോർട്ട്',
    rawTextHide: 'അസംസ്കൃത വാചകം മറയ്ക്കുക',
    rawTextShow: 'അസംസ്കൃത വാചകം കാണുക',
    labels: {
      doc_type: 'രേഖയുടെ തരം',
      stamp_number: 'സ്റ്റാമ്പ് / രജിസ്ട്രേഷൻ നമ്പർ',
      owner_name: 'ഒന്നാം കക്ഷി / ഉടമസ്ഥൻ',
      purchaser_name: 'രണ്ടാം കക്ഷി / വാങ്ങുന്നയാൾ',
      survey_number: 'സർവേ നമ്പർ',
      extent_area: 'വിസ്തൃതി',
      execution_date: 'തീയതി',
      stamp_value: 'സ്റ്റാമ്പ് മൂല്യം',
      location: 'സ്ഥലം',
      languages: 'കണ്ടെത്തിയ ഭാഷകൾ'
    }
  },
  English: {
    title: 'Land Record AI Digitization & Authenticator',
    uploadTitle: '1. Upload or Capture Document Image',
    chooseFile: 'Choose File',
    capturePhoto: '📸 Capture from Camera',
    changeFile: 'Change Document',
    processBtn: 'Digitize & Verify Document',
    processing: 'Processing Multilingual OCR...',
    resetBtn: 'Reset',
    resultTitle: '2. Extraction & Verification Summary',
    listenVoice: '🔊 Listen Voice',
    stopVoice: '⏹ Stop Voice',
    exportJson: '📥 JSON Export',
    exportPdf: '📄 Save PDF Report',
    rawTextHide: 'Hide Raw Text',
    rawTextShow: 'View Raw Extracted Text',
    labels: {
      doc_type: 'Document Type',
      stamp_number: 'Stamp / GRN / Reg No.',
      owner_name: 'First Party / Seller',
      purchaser_name: 'Second Party / Purchaser',
      survey_number: 'Survey / Khasra / Plot No.',
      extent_area: 'Extent / Area',
      execution_date: 'Execution Date',
      stamp_value: 'Stamp Value',
      location: 'Location',
      languages: 'Detected Languages'
    }
  }
};

const getBrowserDefaultLanguage = () => {
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
  const code = browserLang.toLowerCase();
  if (code.startsWith('te')) return 'Telugu';
  if (code.startsWith('hi')) return 'Hindi';
  if (code.startsWith('ta')) return 'Tamil';
  if (code.startsWith('ml')) return 'Malayalam';
  return 'English';
};

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [prefLang, setPrefLang] = useState(getBrowserDefaultLanguage);

  const t = TRANSLATIONS[prefLang] || TRANSLATIONS.English;
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
      setError('Please select or capture a land record document image first.');
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

    const { doc_type, owner_name, survey_number, extent_area, location, verification } = data.fields;
    let langCode = 'en-IN';
    if (prefLang === 'Telugu') langCode = 'te-IN';
    else if (prefLang === 'Hindi') langCode = 'hi-IN';
    else if (prefLang === 'Tamil') langCode = 'ta-IN';
    else if (prefLang === 'Malayalam') langCode = 'ml-IN';

    const textToSpeak = `Document Type: ${doc_type}. Owner Name: ${owner_name}. Survey Number: ${survey_number}. Area: ${extent_area}. Location: ${location}. Verification status is ${verification?.status} with confidence score ${verification?.confidence_score}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const exportToJSON = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `land_record_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportToPDF = () => {
    window.print();
  };

  const getStatusBadgeConfig = (status) => {
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
        <div style={styles.topBar}>
          <h1 style={styles.title}>{t.title}</h1>
          <div style={styles.langSelectorWrapper}>
            <label style={styles.langLabel}>🌐 Language:</label>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value)}
              style={styles.langSelect}
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Malayalam">മലയാളം (Malayalam)</option>
            </select>
          </div>
        </div>
        <p style={styles.subtitle}>
          Multi-Script OCR • Camera Capture • Voice Summarizer • Verification Confidence
        </p>
      </header>

      <main style={styles.main}>
        {/* Upload Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{t.uploadTitle}</h2>
          
          <div style={styles.uploadControls}>
            {/* Standard File Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" style={styles.uploadButton}>
              📁 {t.chooseFile}
            </label>

            {/* Direct Camera Capture Input */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="camera-input"
            />
            <label htmlFor="camera-input" style={styles.cameraButton}>
              {t.capturePhoto}
            </label>
          </div>

          {selectedFile && (
            <div style={{ marginTop: '10px' }}>
              <span style={styles.fileName}>Selected File: {selectedFile.name || 'Captured Document Photo'}</span>
            </div>
          )}

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
              {loading ? t.processing : t.processBtn}
            </button>
            {selectedFile && (
              <button onClick={resetAll} style={styles.resetButton}>
                {t.resetBtn}
              </button>
            )}
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {/* Results Card */}
        {data && data.fields && (
          <div style={styles.card}>
            <div style={styles.resultHeader}>
              <h2 style={styles.cardTitle}>{t.resultTitle}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={speakSummary} style={styles.voiceButton}>
                  {isSpeaking ? t.stopVoice : t.listenVoice}
                </button>
                <button onClick={exportToJSON} style={styles.exportButton}>
                  {t.exportJson}
                </button>
                <button onClick={exportToPDF} style={styles.exportButton}>
                  {t.exportPdf}
                </button>
                {data.fields.verification && (
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getStatusBadgeConfig(data.fields.verification.status).bg,
                      color: getStatusBadgeConfig(data.fields.verification.status).text,
                      borderColor: getStatusBadgeConfig(data.fields.verification.status).border,
                    }}
                  >
                    {getStatusBadgeConfig(data.fields.verification.status).label} (
                    {data.fields.verification.confidence_score})
                  </span>
                )}
              </div>
            </div>

            {/* Verification Message & Confidence Score Display */}
            {data.fields.verification && (
              <div style={styles.verificationCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong>Source: {data.fields.verification.registry_source}</strong>
                  <span style={styles.confidencePill}>
                    Confidence Score: <strong>{data.fields.verification.confidence_score}</strong>
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0' }}>{data.fields.verification.message}</p>
              </div>
            )}

            {/* Extracted Fields Grid */}
            <div style={styles.grid}>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.doc_type}</span>
                <span style={styles.fieldValue}>{data.fields.doc_type}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.stamp_number}</span>
                <span style={styles.fieldValue}>{data.fields.stamp_number}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.owner_name}</span>
                <span style={styles.fieldValue}>{data.fields.owner_name}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.purchaser_name}</span>
                <span style={styles.fieldValue}>{data.fields.purchaser_name}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.survey_number}</span>
                <span style={styles.fieldValue}>{data.fields.survey_number}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.extent_area}</span>
                <span style={styles.fieldValue}>{data.fields.extent_area}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.execution_date}</span>
                <span style={styles.fieldValue}>{data.fields.execution_date}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.stamp_value}</span>
                <span style={styles.fieldValue}>{data.fields.stamp_value}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.location}</span>
                <span style={styles.fieldValue}>{data.fields.location}</span>
              </div>
              <div style={styles.fieldBox}>
                <span style={styles.fieldLabel}>{t.labels.languages}</span>
                <span style={{ ...styles.fieldValue, color: '#38bdf8' }}>
                  {data.fields.languages ? data.fields.languages.join(', ') : 'English'}
                </span>
              </div>
            </div>

            {/* Raw Text Toggle */}
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setShowRawText(!showRawText)} style={styles.toggleButton}>
                {showRawText ? t.rawTextHide : t.rawTextShow}
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    margin: '0 auto 12px auto',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: 0,
    textAlign: 'left',
  },
  langSelectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e293b',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  langLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '600',
  },
  langSelect: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    border: '1px solid #475569',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
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
  uploadControls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '12px',
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
  cameraButton: {
    backgroundColor: '#0d9488',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
  },
  fileName: {
    fontSize: '13px',
    color: '#cbd5e1',
  },
  previewContainer: {
    textAlign: 'center',
    margin: '16px 0',
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
    marginTop: '12px',
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
  exportButton: {
    backgroundColor: '#475569',
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
  confidencePill: {
    backgroundColor: '#1e293b',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#38bdf8',
    border: '1px solid #334155',
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
    boxSizing: 'box-sizing',
  },
};