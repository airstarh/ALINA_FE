import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
import '@ckeditor/ckeditor5-build-classic/build/translations/en-gb';
import TextTransformation            from '@ckeditor/ckeditor5-typing/src/texttransformation';
import EssentialsPlugin              from '@ckeditor/ckeditor5-essentials/src/essentials';
import BoldPlugin                    from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin                  from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin                    from '@ckeditor/ckeditor5-link/src/link';
import LinkImage                     from '@ckeditor/ckeditor5-link/src/linkimage';
import ParagraphPlugin               from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Alignment                     from '@ckeditor/ckeditor5-alignment/src/alignment';
import Table                         from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar                  from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import PasteFromOffice               from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import EasyImage                     from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import CloudServices                 from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import ImageUpload                   from '@ckeditor/ckeditor5-image/src/imageupload';
import Image                         from '@ckeditor/ckeditor5-image/src/image';
import ImageToolbar                  from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption                  from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle                    from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize                   from '@ckeditor/ckeditor5-image/src/imageresize';
import {MyCustomUploadAdapterPlugin} from "@/Utils/AlinaCustomUploader";
import Font                          from '@ckeditor/ckeditor5-font/src/font';
import Underline                     from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough                 from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code                          from '@ckeditor/ckeditor5-basic-styles/src/code';
import CodeBlock                     from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Subscript                     from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript                   from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import MediaEmbed                    from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import List                          from '@ckeditor/ckeditor5-list/src/list';
import TodoList                      from '@ckeditor/ckeditor5-list/src/todolist';
import RemoveFormat                  from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Indent                        from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock                   from '@ckeditor/ckeditor5-indent/src/indentblock';
import CurrentLocale                 from "@/services/CurrentLocale";
const ConfigCkEditor = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    language:     CurrentLocale.language,
    plugins:      [
        TextTransformation,
        MediaEmbed,
        Superscript,
        Subscript,
        Code,
        CodeBlock,
        Strikethrough,
        Underline,
        Font,
        EasyImage,
        CloudServices,
        ImageUpload,
        EssentialsPlugin,
        BoldPlugin,
        ItalicPlugin,
        LinkPlugin,
        ParagraphPlugin,
        Alignment,
        Table,
        TableToolbar,
        PasteFromOffice,
        Image,
        ImageToolbar,
        ImageCaption,
        ImageStyle,
        ImageResize,
        LinkImage,
        List,
        TodoList,
        RemoveFormat,
        Indent,
        IndentBlock
    ],
    toolbar:      {
        items: [
            'imageUpload',
            'link',
            'mediaEmbed',
            '|',
            'undo',
            'redo',
            '|',
            'removeFormat',
            'bold',
            'italic',
            'underline',
            'strikethrough',
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
            'tableRow',
            'tableColumn',
            'mergeTableCells',
        ]
    },
    indentBlock:  {
        offset: 10,
        unit:   '%'
    },
    image:        {
        toolbar: ['linkImage', 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles:  [
            'full',
            'alignLeft',
            'alignRight',
        ],
        upload:  {
            panel: {
                items: ['insertImageViaUrl']
            }
        }
    },
    mediaEmbed:   {
        previewsInData: true
    },
    link:         {
        decorators: {
            addTargetToExternalLinks: {
                mode:       'manual',
                label:      'Open in a new tab',
                attributes: {
                    target: '_blank',
                    rel:    'noopener noreferrer'
                }
            }
        },
    },
    // ##################################################
    // typing:       {
    //     transformations: {
    //         remove: [
    //             // Do not use the transformations from the
    //             // 'symbols' and 'quotes' groups.
    //             'symbols',
    //             'quotes',
    //             // As well as the following transformations.
    //             'arrowLeft',
    //             'arrowRight'
    //         ],
    //         extra:  [
    //             // Add some custom transformations – e.g. for emojis.
    //             {from: ':)', to: '🙂'},
    //             {from: ')))', to: '🙂'},
    //             {from: ':+1:', to: '👍'},
    //             {from: ':tada:', to: '🎉'},
    //             // You can also define patterns using regular expressions.
    //             // Note: The pattern must end with `$` and all its fragments must be wrapped
    //             // with capturing groups.
    //             // The following rule replaces ` "foo"` with ` «foo»`.
    //             {
    //                 from: /(^|\s)(")([^"]*)(")$/,
    //                 to:   [null, '«', null, '»']
    //             },
    //             // Finally, you can define `to` as a callback.
    //             // This (naive) rule will auto-capitalize the first word after a period.
    //             {
    //                 from: /(\. )([a-z])$/,
    //                 to:   matches => [null, matches[1].toUpperCase()]
    //             },
    //             {
    //                 from: /(^|\s)(#[a-zA-Z0-9][\w-]*)(\s+?)$/,
    //                 to:   matches => {
    //                     return [null, `<a>${matches[1]}</a>`, null];
    //                 }
    //             }
    //         ],
    //     }
    // }
    // ##################################################
    // cloudServices: {
    //     isEnabled: false,
    //     CloudServicesUploadAdapter: {
    //         isEnabled: false
    //     }
    // },
};
export default ConfigCkEditor;
