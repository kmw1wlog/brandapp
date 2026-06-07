export type BrandAssetKind =
  | "storefront"
  | "interior"
  | "logo"
  | "signature_menu"
  | "menu_board"
  | "packaging"
  | "delivery_thumbnail"
  | "promotion";

export type KieCreateTaskPayload = {
  model: string;
  callBackUrl?: string;
  input: {
    prompt: string;
    image_input: string[];
    aspect_ratio: "16:9";
    resolution: "1K";
    output_format: "png";
  };
};

export type BrandAssetJob = {
  id: string;
  brandId: string;
  kind: BrandAssetKind;
  templateUrl: string;
  prompt: string;
  provider: "kie";
  model: "nano-banana-pro";
  taskId?: string;
  status: "template" | "queued" | "generating" | "success" | "fail";
  generatedUrl?: string;
  selectedUrl: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  temporaryUrl?: boolean;
  mock?: boolean;
};
