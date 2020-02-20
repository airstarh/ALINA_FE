import EssentialsPlugin              from '@ckeditor/ckeditor5-essentials/src/essentials';
import BoldPlugin                    from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin                  from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin                    from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin               from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Alignment                     from '@ckeditor/ckeditor5-alignment/src/alignment';
import Table                         from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar                  from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import PasteFromOffice               from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
//##
import EasyImage                     from '@ckeditor/ckeditor5-easy-image/src/easyimage';
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
import Subscript                     from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript                   from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import MediaEmbed                    from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

const ConfigCkEditor = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    plugins:      [
        MediaEmbed,
        Superscript,
        Subscript,
        Code,
        Strikethrough,
        Underline,
        Font,
        EasyImage,
        //CKFinder,
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
    ],
    toolbar:      {
        items: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            'subscript',
            'superscript',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'link',
            'alignment',
            '|',
            'insertTable',
            'tableRow',
            'tableColumn',
            'mergeTableCells',
            '|',
            //'ckfinder',
            'imageUpload',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
        ]
    },
    image:        {
        toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
        styles:  [
            'full',
            'alignLeft',
            'alignRight'
        ],
    },
    // ckfinder:     {
    //     uploadUrl: `${ConfigApi.url_base}/FileUpload/Common`
    // },
};
export default ConfigCkEditor;
