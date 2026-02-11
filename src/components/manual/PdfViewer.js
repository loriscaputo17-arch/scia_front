"use client";

import dynamic from "next/dynamic";

const PdfViewerClient = dynamic(
  () => import("./PdfViewer.client"),
  { ssr: false }
);

export default function PdfViewer(props) {
  return <PdfViewerClient {...props} />;
}
