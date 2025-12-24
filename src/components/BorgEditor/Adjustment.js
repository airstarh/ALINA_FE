import Expect from './Expect'
import CurrentLocale                 from "@/services/CurrentLocale";
import { MyCustomUploadAdapterPlugin } from "@/Utils/AlinaCustomUploader";

export default class Adjustment {
  ck = null
  // PRODUCTION
  key =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3OTYxNjk1OTksImp0aSI6Ijg1YjExYjY5LTZjMTQtNDU4ZC1iNmQxLTBiZDMxMWEyNjM1ZCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJyZW1vdmVGZWF0dXJlcyI6WyJQQiIsIlJGIiwiU0NIIiwiVENQIiwiVEwiLCJUQ1IiLCJJUiIsIlNVQSIsIkI2NEEiLCJMUCIsIkhFIiwiUkVEIiwiUEZPIiwiV0MiLCJGQVIiLCJCS00iLCJGUEgiLCJNUkUiXSwidmMiOiI0OWUzN2IzMiJ9.K4FZ973y_N9FrURvYD-XPVoEjz-k0cjWtTwrkih-FwvnIKPgWLF9nOxODUXL-_H0h--ohE3_1Lxl1gTR2lkeBQ'
  // TRIAL
  // key = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjU4NDMxOTksImp0aSI6Ijc3M2NiNjJiLTFiYjMtNDRlOC1hM2RjLWFiZGE3YWQzZTFjMiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjVkMWNlNjE2In0.ntLXR_KkvMJzA1gIAHVdVCRHjOQHOX5ssnazAlu3BJatFlO9sB8gxM9VrNNTHsbL5Oga5BENoXuCzuGXfKW-bQ';
  // DEV
  // key = '';
  editor = null
  tools = null
  lang = 'en'

  constructor () {
    // this.setConfig(window.CKEDITOR);
    const _this = this
    Expect(window, 'CKEDITOR', _this, 'ck').then(ck => {
      _this.setConfig(ck)
    })
  }
  
  setConfig (ck) {
    this.editor = ck.ClassicEditor
    this.tools = {
      licenseKey: this.key,
      language: CurrentLocale.language,
      extraPlugins: [MyCustomUploadAdapterPlugin],
      plugins: [
        ck.Image,
        ck.ImageInsert,
        ck.ImageToolbar,
        ck.ImageCaption,
        ck.EasyImage,
        ck.LinkImage,
        ck.ImageStyle,
        ck.ImageTextAlternative,
        ck.IndentBlock,
        ck.Indent,
        ck.TodoList,
        ck.List,
        ck.TableToolbar,
        ck.Table,
        ck.Alignment,
        ck.CloudServices,
        ck.Font,
        ck.Underline,
        ck.Strikethrough,
        ck.CodeBlock,
        ck.Code,
        ck.Subscript,
        ck.Superscript,
        ck.MediaEmbed,
        ck.TextTransformation,
        ck.Link,
        ck.Essentials,
        ck.Paragraph,
        ck.Bold,
        ck.Italic,
        ck.TableProperties,
        ck.TableCellProperties,
        ck.ImageResize, // PREMIUM
        ck.RemoveFormat // PREMIUM
        // ck.PasteFromOffice, // PREMIUM
      ],

      toolbar: {
        shouldNotGroupWhenFull: true,
        items: [
          'imageInsert',
          'mediaEmbed',
          '|',
          'removeFormat',
          '|',
          'undo',
          'redo',
          '|',
          'link',

          '|',
          // 'removeFormat',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'fontSize',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          '|',
          'code',
          'codeBlock',
          'subscript',
          'superscript',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'alignment',
          'outdent',
          'indent',
          '|',
          'insertTable',
        ]
      },
      table: {
        contentToolbar: [
            'tableProperties',
          'tableRow',
          'tableColumn',
          'mergeTableCells',
          'tableCellProperties'
        ]
      },
      image: {
        toolbar: [
          'imageStyle:block',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'imageStyle:inline',
          'imageStyle:left',
          'imageStyle:right',
          '|',
          'imageTextAlternative',
          'toggleImageCaption',
          'linkImage'
        ]
        // upload: {
        //     panel: {
        //         items: ['insertImageViaUrl']
        //     }
        // }
      },
      mediaEmbed: {
        previewsInData: true,
        extraProviders: [
          {
            name: 'allVideo',
            url: [
              /^https?:\/\/(.+)\.(mp4)/,
              /^https?:\/\/(.+)\.(mpa)/,
              /^https?:\/\/(.+)\.(ogv)/,
              /^https?:\/\/(.+)\.(ogg)/,
              /^https?:\/\/(.+)\.(webm)/
            ],
            html: match => {
              const vocTypes = {
                ogv: 'ogg',
                ogg: 'ogg',
                mp4: 'mp4',
                mpa: 'mp4',
                webm: 'webm'
              }
              const id = match[0]
              const type = vocTypes[match[2]]
              return (
                '<figure class="alina-figure-content">' +
                '<video controls style="width: 100%; margin: 0 auto; text-align: center;" preload="none">' +
                `<source src="${id}" type="video/${type}">` +
                '</video>' +
                '</figure>'
              )
            }
          },
          {
            name: 'allAudio',
            url: [
              /^https?:\/\/(.+)\.(mp3)/,
              /^https?:\/\/(.+)\.(wav)/,
              /^https?:\/\/(.+)\.(ape)/,
              /^https?:\/\/(.+)\.(flac)/
            ],
            html: match => {
              const vocTypes = {
                mp3: 'mp3',
                wav: 'wav',
                ape: 'ape',
                flac: 'flac'
              }
              const id = match[0]
              //const trackName = id.split(/[#?]/)[0].split('.').pop().trim();
              const trackName = id.split('/').pop()
              const type = vocTypes[match[2]]
              return (
                '<figure class="alina-figure-content">' +
                '<audio controls style="width: 100%; margin: 0 auto; text-align: center;" preload="none">' +
                `<source src="${id}" type="audio/${type}">` +
                '</audio>' +
                '<figurecaption style="text-align: right;">' +
                `${trackName}` +
                '</figurecaption>' +
                '</figure>'
              )
            }
          }
        ]
      },
      link: {
        decorators: {
          addTargetToExternalLinks: {
            mode: 'manual',
            label: 'Open in a new tab',
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          }
        }
      }
    }
  }
}
