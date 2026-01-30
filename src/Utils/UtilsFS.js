export default class UtilsFS {

	static typeGeneric = 'generic';
	static typeImage = 'image';
	static typeText = 'text';
	static typeTextVector = 'text_vector';
	static typeTable = 'table';
	static typePresentation = 'presentation';
	static typeAudio = 'audio';
	static typeVideo = 'video';
	static typeWeb = 'web';
	static typeArchive = 'archive';
	static typePdf = 'pdf';
	static typeEmail = 'email_message';

	static fType = {
		generic: UtilsFS.typeGeneric,
		txt: UtilsFS.typeText,
		json: UtilsFS.typeText,
		doc: UtilsFS.typeTextVector,
		docx: UtilsFS.typeTextVector,
		odf: UtilsFS.typeTextVector,
		xls: UtilsFS.typeTable,
		xlsx: UtilsFS.typeTable,
		ppt: UtilsFS.typePresentation,
		pptx: UtilsFS.typePresentation,
		msg: UtilsFS.typeEmail,
		pdf: UtilsFS.typePdf,
		zip: UtilsFS.typeArchive,
		rar: UtilsFS.typeArchive,
		arj: UtilsFS.typeArchive,
		htm: UtilsFS.typeWeb,
		html: UtilsFS.typeWeb,
		mp3: UtilsFS.typeAudio,
		wav: UtilsFS.typeAudio,
		mp4: UtilsFS.typeVideo,
		avi: UtilsFS.typeVideo,
		png: UtilsFS.typeImage,
		jpg: UtilsFS.typeImage,
		jpeg: UtilsFS.typeImage,
		gif: UtilsFS.typeImage,
		webp: UtilsFS.typeImage,
	}

	static ext(strFileName) {
		return strFileName.split('.').pop().toLowerCase();
	}

	static getType(strFileName) {
		const ext = UtilsFS.ext(strFileName);
		if (UtilsFS.fType.hasOwnProperty(ext)) {
			return UtilsFS.fType[ext];
		}
		return UtilsFS.fType.generic;
	}

}