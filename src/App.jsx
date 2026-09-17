import React, { useState } from 'react';

const UI_TRANSLATIONS = {
  English: {
    title: 'SIH26018: Smart Land Record Digitization',
    subtitle: 'Universal AI Document Parsing & Verification System',
    uploadHeader: 'Upload Any Land Record',
    uploadDesc: 'Supports Sale Deeds, Stamp Papers, 7/12, Patta & Encumbrance Certificates',
    btnExtract: 'Extract & Verify Document',
    btnListen: '🔊 Listen to Summary (Voice)',
    docType: 'Detected Document Type',
    owner: 'Owner / First Party',
    purchaser: 'Purchaser / Second Party',
    surveyNo: 'Survey / Plot Number',
    extent: 'Land Area / Extent',
    stampNo: 'Stamp Serial / Reg. No.',
    date: 'Execution Date',
    value: 'Valuation / Stamp Duty',
    location: 'District / Location'
  },
  Hindi: {
    title: 'SIH26018: भूमि दस्तावेज़ एआई प्रणाली',
    subtitle: 'सार्वभौमिक दस्तावेज़ निष्कर्षण और सत्यापन प्रणाली',
    uploadHeader: 'कोई भी भूमि दस्तावेज़ अपलोड करें',
    uploadDesc: 'बिक्री विलेख, स्टाम्प पेपर, खसरा/खतौनी, पट्टा और भार प्रमाण पत्र का समर्थन करता है',
    btnExtract: 'विश्लेषण और सत्यापन करें',
    btnListen: '🔊 विवरण सुनें (आवाज में)',
    docType: 'दस्तावेज़ का प्रकार',
    owner: 'मालिक / प्रथम पक्ष',
    purchaser: 'खरीदार / द्वितीय पक्ष',
    surveyNo: 'सर्वेक्षण / भूखंड संख्या',
    extent: 'भूमि का क्षेत्रफल',
    stampNo: 'स्टाम्प / पंजीकरण संख्या',
    date: 'निष्पादन तिथि',
    value: 'मूल्यांकन / स्टाम्प शुल्क',
    location: 'जिला / स्थान'
  },
  Gujarati: {
    title: 'SIH26018: જમીન દસ્તાવેજ એઆઈ સિસ્ટમ',
    subtitle: 'સાર્વત્રિક કાનૂની દસ્તાવેજ ચકાસણી સિસ્ટમ',
    uploadHeader: 'કોઈપણ જમીન દસ્તાવેજ અપલોડ કરો',
    uploadDesc: 'વેચાણ દસ્તાવેજ, સ્ટેમ્પ પેપર, ૭/૧૨ ઉતારો, અને હક્ક પત્રકને સપોર્ટ કરે છે',
    btnExtract: 'વિશ્લેષણ અને ચકાસણી કરો',
    btnListen: '🔊 અવાજમાં સાંભળો',
    docType: 'દસ્તાવેજનો પ્રકાર',
    owner: 'માલિક / પ્રથમ પક્ષ',
    purchaser: 'ખરીદનાર / દ્વિતીય પક્ષ',
    surveyNo: 'સરવે / બ્લોક નંબર',
    extent: 'જમીનનું ક્ષેત્રફળ',
    stampNo: 'સ્ટેમ્પ નોંધણી નંબર',
    date: 'નોંધણી તારીખ',
    value: 'સ્ટેમ્પ કિંમત / મૂલ્યાંકન',
    location: 'જિલ્લો / સ્થળ'
  },
  Telugu: {
    title: 'SIH26018: భూ రికార్డుల AI వ్యవస్థ',
    subtitle: 'సార్వత్రిక భూ పత్రాల విశ్లేషణ మరియు పరిశీలన వ్యవస్థ',
    uploadHeader: 'ఏదైనా భూ పత్రాన్ని అప్‌లోడ్ చేయండి',
    uploadDesc: 'సేల్ డీడ్, స్టాంప్ పేపర్లు, పట్టాదార్ పాస్‌బుక్, EC లకు మద్దతు ఇస్తుంది',
    btnExtract: 'విశ్లేషించండి & తనిఖీ చేయండి',
    btnListen: '🔊 వాయిస్ సారాంశం వినండి',
    docType: 'పత్రం రకం',
    owner: 'యజమాని / మొదటి పక్షం',
    purchaser: 'కొనుగోలుదారు / రెండవ పక్షం',
    surveyNo: 'సర్వే / సర్వే నంబర్',
    extent: 'భూమి విస్తీర్ణం',
    stampNo: 'స్టాంప్ రిజిస్ట్రేషన్ నంబర్',
    date: 'నమోదు తేదీ',
    value: 'స్టాంప్ రుసుము / విలువ',
    location: 'జిల్లా / ప్రాంతం'
  }
};

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState('structured');

  const t = UI_TRANSLATIONS[language];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a land record document first.');
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('/api/ocr', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('OCR Failed');
      const result = await response.json();
      setData(result);
    } catch (err) {
      alert('Error connecting to backend server. Ensure main.py is active.');
    } finally {
      setLoading(false);
    }
  };

  const speakSummary = () => {
    if (!data) return;
    const fields = data.fields;
    const textToSpeak = `Document Type: ${fields.doc_type}. Primary Owner: ${fields.owner_name}. Survey Number: ${fields.survey_number}. Land Area: ${fields.extent_area}. Status: ${fields.verification.status}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', backgroundColor: '#090d16', color: '#f1f5f9', minHeight: '100vh', padding: '24px' }}>
      
      {/* Header Bar */}
      <header style={{ backgroundColor: '#1e293b', padding: '20px 28px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>{t.title}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>{t.subtitle}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>🌐 Interface Script:</span>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Gujarati">ગુજરાતી (Gujarati)</option>
            <option value="Telugu">తెలుగు (Telugu)</option>
          </select>
        </div>
      </header>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '24px' }}>
        
        {/* Input Panel */}
        <div style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h3 style={{ marginTop: 0, color: '#f8fafc' }}>{t.uploadHeader}</h3>
          <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>{t.uploadDesc}</p>
          
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ margin: '15px 0', width: '100%', color: '#94a3b8' }} />

          {previewUrl && (
            <div style={{ backgroundColor: '#030712', padding: '12px', borderRadius: '10px', textAlign: 'center', marginBottom: '16px' }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '6px' }} />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: !file ? '#1e293b' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: !file ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing Document Details...' : t.btnExtract}
          </button>
        </div>

        {/* Dynamic Extraction Results Panel */}
        <div style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setActiveTab('structured')} 
                style={{ backgroundColor: activeTab === 'structured' ? '#1e293b' : 'transparent', color: '#38bdf8', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📊 Extracted Fields
              </button>
              <button 
                onClick={() => setActiveTab('raw')} 
                style={{ backgroundColor: activeTab === 'raw' ? '#1e293b' : 'transparent', color: '#38bdf8', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📝 Raw OCR Stream
              </button>
            </div>

            {data && (
              <button 
                onClick={speakSummary} 
                style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t.btnListen}
              </button>
            )}
          </div>

          {!data && !loading && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '80px 0' }}>
              <p>Upload a land document on the left panel to execute multi-script AI extraction.</p>
            </div>
          )}

          {loading && <p style={{ color: '#38bdf8', textAlign: 'center', padding: '60px 0' }}>Analyzing document text, parsing survey numbers, and verifying authenticity...</p>}

          {data && activeTab === 'structured' && (
            <div>
              {/* Verification Status Banner */}
              <div style={{
                backgroundColor: data.fields.verification.status === 'VERIFIED_GENUINE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: data.fields.verification.status === 'VERIFIED_GENUINE' ? '1px solid #10b981' : '1px solid #ef4444',
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: data.fields.verification.status === 'VERIFIED_GENUINE' ? '#34d399' : '#f87171' }}>
                    {data.fields.verification.status === 'VERIFIED_GENUINE' ? '✓ VERIFIED GENUINE RECORD' : '⚠️ UNVERIFIED RECORD / AUDIT REQUIRED'}
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#0f172a', padding: '4px 8px', borderRadius: '12px', color: '#38bdf8' }}>
                    Score: {data.fields.verification.confidence_score}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  {data.fields.verification.message}
                </p>
              </div>

              {/* Document Script Tags */}
              <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Scripts Detected:</span>
                {data.fields.languages.map((lang, i) => (
                  <span key={i} style={{ backgroundColor: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #334155' }}>
                    {lang}
                  </span>
                ))}
              </div>

              {/* Dynamic Extracted Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.docType}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold', color: '#f8fafc', fontSize: '15px' }}>{data.fields.doc_type}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.owner}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold', color: '#34d399' }}>{data.fields.owner_name}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.purchaser}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold', color: '#38bdf8' }}>{data.fields.purchaser_name}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.surveyNo}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold', color: '#fbbf24' }}>{data.fields.survey_number}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.extent}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold', color: '#a78bfa' }}>{data.fields.extent_area}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.stampNo}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold' }}>{data.fields.stamp_number}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.date}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold' }}>{data.fields.execution_date}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.value}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold' }}>{data.fields.stamp_value}</p>
                </div>

                <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t.location}</span>
                  <p style={{ margin: '3px 0 0 0', fontWeight: 'bold' }}>{data.fields.location}</p>
                </div>
              </div>
            </div>
          )}

          {data && activeTab === 'raw' && (
            <pre style={{ backgroundColor: '#030712', color: '#38bdf8', padding: '14px', borderRadius: '8px', fontSize: '12px', height: '340px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {data.raw_text}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}