import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportComponentAsPDF = async (elementId: string, fileName: string = "Rapor") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // Generate canvas from DOM element
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, // Allow cross-origin images if any
      logging: false,
      backgroundColor: "#0f172a", // Match dashboard dark background to avoid white borders
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    
    // Create PDF with EXACTLY the dimensions of the generated canvas
    // This completely removes any white space at the bottom
    const pdfWidth = canvas.width;
    const pdfHeight = canvas.height;
    
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "px",
      format: [pdfWidth, pdfHeight]
    });

    // Add image starting exactly at 0,0 and filling the exact PDF size
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    // Download the PDF
    pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error("PDF oluşturulurken hata:", error);
    alert("PDF oluşturulurken bir hata meydana geldi.");
  }
};
