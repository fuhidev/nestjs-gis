import { SpatialReference } from '../spatial-reference';

  export interface AdvancedQueryCapabilities {
      supportsPagination: boolean;
      supportsQueryWithDistance: boolean;
      supportsReturningQueryExtent: boolean;
      supportsStatistics: boolean;
      supportsOrderBy: boolean;
      supportsDistinct: boolean;
  }


  export interface Extent {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
      spatialReference: SpatialReference;
  }

  export interface Symbol {
      type: string;
      url: string;
      imageData: string;
      contentType: string;
      width: number;
      height: number;
      angle: number;
      xoffset: number;
      yoffset: number;
  }

  export interface Renderer {
      type: string;
      symbol: Symbol;
      label: string;
      description: string;
  }

  export interface DrawingInfo {
      renderer: Renderer;
      transparency: number;
      labelingInfo?: any;
  }

  export interface CodedValue {
      name: string;
      code: number;
  }

  export interface Domain {
      type: string;
      name: string;
      codedValues: CodedValue[];
  }

  export interface Field {
      name: string;
      type: string;
      alias: string;
      domain: Domain;
      editable: boolean;
      nullable: boolean;
      length?: number;
  }

  export interface Index {
      name: string;
      fields: string;
      isAscending: boolean;
      isUnique: boolean;
      description: string;
  }

  export interface DateFieldsTimeReference {
      timeZone: string;
      respectsDaylightSaving: boolean;
  }

  export interface Attributes {
      MaDuong?: any;
      GiaiDoanQuyHoach?: any;
      TenTiepDia?: any;
      ToaDoX?: any;
      ToaDoY?: any;
      NgayCapNhat?: any;
      NguoiCapNhat?: any;
      DonViQuanLy?: any;
      DonViCapNhat?: any;
      GhiChu?: any;
      MaPhuongXa?: any;
      MaQuanHuyen?: any;
      MaDoiTuong?: any;
      CheckTool?: any;
      TinhTrang?: any;
  }

  export interface Prototype {
      attributes: Attributes;
  }

  export interface Template {
      name: string;
      description: string;
      prototype: Prototype;
      drawingTool: string;
  }

  export interface FeatureServerMetadata {
      currentVersion: number;
      id: number;
      name: string;
      type: string;
      description: string;
      copyrightText: string;
      defaultVisibility: boolean;
      editFieldsInfo?: any;
      ownershipBasedAccessControlForFeatures?: any;
      syncCanReturnChanges: boolean;
      relationships: any[];
      isDataVersioned: boolean;
      supportsRollbackOnFailureParameter: boolean;
      supportsStatistics: boolean;
      supportsAdvancedQueries: boolean;
      supportsValidateSQL: boolean;
      supportsCalculate: boolean;
      advancedQueryCapabilities: AdvancedQueryCapabilities;
      geometryType: string;
      minScale: number;
      maxScale: number;
      extent: Extent;
      drawingInfo: DrawingInfo;
      hasM: boolean;
      hasZ: boolean;
      allowGeometryUpdates: boolean;
      hasAttachments: boolean;
      supportsApplyEditsWithGlobalIds: boolean;
      htmlPopupType: string;
      objectIdField: string;
      globalIdField: string;
      displayField: string;
      typeIdField: string;
      fields: Field[];
      indexes: Index[];
      dateFieldsTimeReference: DateFieldsTimeReference;
      types: any[];
      templates: Template[];
      maxRecordCount: number;
      supportedQueryFormats: string;
      capabilities: string;
      useStandardizedQueries: boolean;
  }

