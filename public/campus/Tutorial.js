import Step1 from './Step_1.png';
import Step2 from './Step_2.png';
import Step3 from './Step_3.png';
import Step4 from './Step_4.png';
import Step5 from './Step_5.png';
import Step6 from './Step_6.png';
import Step7 from './Step_7.png';

const tutorialSteps = [
    { step: 1, text: `Right click anywhere on the page that's not an image/video`, src: Step1.src, alt: "Step 1", width: 1094, height: 524 },
    { step: 2, text: `Click "Inspect"`, src: Step2.src, alt: "Step 2", width: 768, height: 388 },
    { step: 3, text: `Click "Network"`, src: Step3.src, alt: "Step 3", width: 768, height: 388 },
    { step: 4, text: `Write "doc"`, src: Step4.src, alt: "Step 4", width: 766, height: 388 },
    { step: 5, text: `Press Ctrl+R`, src: Step5.src, alt: "Step 5", width: 851, height: 431 },
    { step: 6, text: `Click "0?bust=X"`, src: Step6.src, alt: "Step 6", width: 851, height: 431 },
    { step: 7, text: `Copy this URL`, src: Step7.src, alt: "Step 7", width: 768, height: 388 }
];

function Tutorial() {
    return (
        <div>
            {tutorialSteps.map(({ step, text, src, alt, width, height }) => (
                <div key={step} style={{ marginBottom: '20px' }}>
                    <h2>Step {step}</h2>
                    <p style={{ fontSize: '115%', fontFamily: 'sans-serif' }}>{text}</p>
                    <img src={src} alt={alt} width={width} height={height} />
                </div>
            ))}
        </div>
    );
}

export default Tutorial;