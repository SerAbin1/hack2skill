import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

const ResumeUpload = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setLoading(true);
        setError('');
        setSkills([]);

        try {
            let text = '';
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    fullText += content.items.map(item => item.str).join(' ') + '\n';
                }
                text = fullText;
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            } else {
                setError('Unsupported file type. Please upload a PDF or DOCX file.');
                setLoading(false);
                return;
            }

            extractSkills(text.toLowerCase());
        } catch (err) {
            console.error('Error processing file:', err);
            setError('An error occurred while processing the file.');
        } finally {
            setLoading(false);
        }
    };

    const extractSkills = async (text) => {
        try {
            const response = await fetch('/skills.json');
            const skillsData = await response.json();
            const flatSkills = Object.values(skillsData).flat().map(skill => skill.toLowerCase());
            
            const foundSkills = new Set();
            flatSkills.forEach(skill => {
                if (text.includes(skill)) {
                    foundSkills.add(skill);
                }
            });

            setSkills([...foundSkills]);
        } catch (err) {
            console.error('Error fetching or processing skills:', err);
            setError('An error occurred while extracting skills.');
        }
    };

    return (
        <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx" 
              style={{ display: 'none' }} 
            />
            <button onClick={handleButtonClick} className="menu-btn">Browse</button>
            {loading && <p>Processing...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {skills.length > 0 && (
                <div>
                    <h3>Detected Skills:</h3>
                    <ul>
                        {skills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;