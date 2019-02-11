import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  data() {
    return {
      title: "Add Product",
      dialog: false,
      fillable: [
        {
          key: "code",
          caption: "Product Code",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "product_category_id",
          caption: "Category",
          value: "",
          rules: "required|integer"
        },
        {
          key: "name",
          caption: "Product Name",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "material",
          caption: "Product Material",
          value: "",
          rules: "max:250"
        },
        {
          key: "regular_price",
          caption: "Regular Price",
          value: "",
          rules: "required|integer"
        },
        {
          key: "sell_price",
          caption: "Sell Price",
          value: "",
          rules: "integer"
        },
        {
          key: "discount",
          caption: "Discount",
          value: "",
          rules: "integer"
        },
        {
          key: "tax",
          caption: "Tax",
          value: "",
          rules: "integer"
        },
        {
          key: "stock",
          caption: "Stock",
          value: "",
          rules: "integer"
        },
        {
          key: "ordering",
          caption: "Menu Ordering",
          value: "",
          rules: "integer"
        },
        {
          key: "stock_status_id",
          caption: "Stock Status",
          value: "",
          rules: "required|integer"
        },
        {
          key: "is_featured",
          caption: "Make featured",
          value: "",
          rules: ""
        },
        {
          key: "is_publish",
          caption: "Publish",
          value: "",
          rules: ""
        }
      ],
      formData: {},
      typeNumbers: [
        "regular_price",
        "sell_price",
        "discount",
        "tax",
        "stock",
        "ordering"
      ],
      notInclude: [
        "product_category_id",
        "stock_status_id",
        "is_featured",
        "is_publish"
      ],
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "bulletedList",
          "numberedList",
          "blockQuote"
        ]
      },
      attributeNames: ["color", "size"],
      attributeName: "",
      attributeValue: "",
      attributes: [],
      shipping: {}
    };
  }
};
