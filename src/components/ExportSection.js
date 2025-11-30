import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportSection = ({ svgRef }) => {
    const [isExportingJPG, setIsExportingJPG] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    const exportAsJPG = async () => {
        if (isExportingJPG || !svgRef) return;
        setIsExportingJPG(true);
        try {
        let svgElement = svgRef.current;
        
        const viewBox = svgElement.viewBox.baseVal;
        const originalWidth = viewBox.width;
        const originalHeight = viewBox.height;
        
        // Create a temporary container with fixed original size
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = originalWidth + 'px';
        tempContainer.style.height = originalHeight + 'px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.overflow = 'hidden';
        
        // Clone the entire SVG container and reset all transforms
        const svgClone = svgRef.current.cloneNode(true);
        const svgCloneElement = svgClone.querySelector('svg');
        
        if (svgCloneElement) {
            // Reset all transforms and positioning
            svgCloneElement.style.transform = 'none';
            svgCloneElement.style.position = 'static';
            svgCloneElement.style.left = '0';
            svgCloneElement.style.top = '0';
            svgCloneElement.style.width = originalWidth + 'px';
            svgCloneElement.style.height = originalHeight + 'px';
            svgCloneElement.style.display = 'block';
        }
        
        // Reset the container's transform as well
        svgClone.style.transform = 'none';
        svgClone.style.position = 'static';
        svgClone.style.left = '0';
        svgClone.style.top = '0';
        svgClone.style.width = originalWidth + 'px';
        svgClone.style.height = originalHeight + 'px';
        
        tempContainer.appendChild(svgClone);
        document.body.appendChild(tempContainer);
        
        // Wait a bit for the SVG to render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: 'white',
            scale: 8,
            useCORS: true,
            allowTaint: true,
            width: originalWidth,
            height: originalHeight,
            logging: false
        });
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        const link = document.createElement('a');
        link.download = 'Modelnaya.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.85);
        link.click();
        } catch (error) {
        console.error('Error exporting JPG:', error);
        } finally {
        setIsExportingJPG(false);
        }
    };


    const exportAsPDF = async () => {
        if (isExportingPDF || !svgRef?.current) return;
        setIsExportingPDF(true);
        try {
        let svgElement = svgRef.current.querySelector('svg');
        
        if (!svgElement && svgRef.current.tagName === 'svg') {
            svgElement = svgRef.current;
        }
        
        if (!svgElement) {
            svgElement = document.querySelector('svg');
        }
        
        if (!svgElement) {
            console.error('SVG element not found anywhere');
            return;
        }
        
        const viewBox = svgElement.viewBox.baseVal;
        const originalWidth = viewBox.width;
        const originalHeight = viewBox.height;
        
        // Create a temporary container with fixed original size
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = originalWidth + 'px';
        tempContainer.style.height = originalHeight + 'px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.overflow = 'hidden';
        
        // Clone the entire SVG container and reset all transforms
        const svgClone = svgRef.current.cloneNode(true);
        const svgCloneElement = svgClone.querySelector('svg');
        
        if (svgCloneElement) {
            // Reset all transforms and positioning
            svgCloneElement.style.transform = 'none';
            svgCloneElement.style.position = 'static';
            svgCloneElement.style.left = '0';
            svgCloneElement.style.top = '0';
            svgCloneElement.style.width = originalWidth + 'px';
            svgCloneElement.style.height = originalHeight + 'px';
            svgCloneElement.style.display = 'block';
        }
        
        // Reset the container's transform as well
        svgClone.style.transform = 'none';
        svgClone.style.position = 'static';
        svgClone.style.left = '0';
        svgClone.style.top = '0';
        svgClone.style.width = originalWidth + 'px';
        svgClone.style.height = originalHeight + 'px';
        
        tempContainer.appendChild(svgClone);
        document.body.appendChild(tempContainer);
        
        // Wait a bit for the SVG to render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: 'white',
            scale: 8,
            useCORS: true,
            allowTaint: true,
            width: originalWidth,
            height: originalHeight,
            logging: false
        });
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [originalWidth, originalHeight]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, originalWidth, originalHeight);
        
        pdf.save('Modelnaya.pdf');
        } catch (error) {
        console.error('Error exporting PDF:', error);
        } finally {
        setIsExportingPDF(false);
        }
    };

    return (
      <>
        <div className="grow md:border-t md:border-gray-200 md:pt-3 md:mt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 hidden md:block">Скачать карту</h4>
          <div className="flex md:gap-2 items-stretch h-full">
            <ExportButton
              onClick={exportAsJPG}
              disabled={isExportingJPG || isExportingPDF}
              loading={isExportingJPG}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              }
              text="JPG"
              color="bg-blue-500"
            />
            <ExportButton
              onClick={exportAsPDF}
              disabled={isExportingJPG || isExportingPDF}
              loading={isExportingPDF}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              }
              text="PDF"
              color="bg-red-500"
            />
          </div>
        </div>
      </>
    );
};
export default ExportSection;

const ExportButton = ({ onClick, disabled, loading, icon, text, color, fullWidth = false }) => {
    return (
        <button
        onClick={onClick}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : 'flex-1'} px-3 py-2 text-xs font-bold ${color} text-white md:rounded hover:opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
        {loading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            icon
        )}
        <span>{text}</span>
        </button>
    );
};