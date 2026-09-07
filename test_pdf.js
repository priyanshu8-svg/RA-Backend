import * as PdfParse from "pdf-parse";
try {
    const p = new PdfParse.PDFParse(new Uint8Array([1,2,3]));
    console.log("PDFParse instance created");
} catch (e) {
    console.error("PDFParse error:", e.message);
}
