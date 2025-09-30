import { DataType } from '../ebml/types.js';
/**
 * Elements of document type description
 * Derived from https://github.com/tungol/EBML/blob/master/doctypes/matroska.dtd
 * Extended with:
 * - https://www.matroska.org/technical/specs/index.html
 */
export const matroskaDtd = {
    name: 'dtd',
    container: {
        0x1a45dfa3: {
            name: 'ebml',
            container: {
                0x4286: { name: 'ebmlVersion', value: DataType.uint }, // 5.1.1
                0x42f7: { name: 'ebmlReadVersion', value: DataType.uint }, // 5.1.2
                0x42f2: { name: 'ebmlMaxIDWidth', value: DataType.uint }, // 5.1.3
                0x42f3: { name: 'ebmlMaxSizeWidth', value: DataType.uint }, // 5.1.4
                0x4282: { name: 'docType', value: DataType.string }, // 5.1.5
                0x4287: { name: 'docTypeVersion', value: DataType.uint }, // 5.1.6
                0x4285: { name: 'docTypeReadVersion', value: DataType.uint } // 5.1.7
            }
        },
        // Matroska segments
        0x18538067: {
            name: 'segment',
            container: {
                // Meta Seek Information (also known as MetaSeek)
                0x114d9b74: {
                    name: 'seekHead',
                    container: {
                        0x4dbb: {
                            name: 'seek',
                            multiple: true,
                            container: {
                                0x53ab: { name: 'id', value: DataType.binary },
                                0x53ac: { name: 'position', value: DataType.uint }
                            }
                        }
                    }
                },
                // Segment Information
                0x1549a966: {
                    name: 'info',
                    container: {
                        0x73a4: { name: 'uid', value: DataType.uid },
                        0x7384: { name: 'filename', value: DataType.string },
                        0x3cb923: { name: 'prevUID', value: DataType.uid },
                        0x3c83ab: { name: 'prevFilename', value: DataType.string },
                        0x3eb923: { name: 'nextUID', value: DataType.uid },
                        0x3e83bb: { name: 'nextFilename', value: DataType.string },
                        0x2ad7b1: { name: 'timecodeScale', value: DataType.uint },
                        0x4489: { name: 'duration', value: DataType.float },
                        0x4461: { name: 'dateUTC', value: DataType.uint },
                        0x7ba9: { name: 'title', value: DataType.string },
                        0x4d80: { name: 'muxingApp', value: DataType.string },
                        0x5741: { name: 'writingApp', value: DataType.string }
                    }
                },
                // Cluster
                0x1f43b675: {
                    name: 'cluster',
                    multiple: true,
                    container: {
                        0xe7: { name: 'timecode', value: DataType.uid },
                        0x58d7: { name: 'silentTracks ', multiple: true },
                        0xa7: { name: 'position', value: DataType.uid },
                        0xab: { name: 'prevSize', value: DataType.uid },
                        0xa0: { name: 'blockGroup' },
                        0xa3: { name: 'simpleBlock' }
                    }
                },
                // Track
                0x1654ae6b: {
                    name: 'tracks',
                    container: {
                        0xae: {
                            name: 'entries',
                            multiple: true,
                            container: {
                                0xd7: { name: 'trackNumber', value: DataType.uint },
                                0x73c5: { name: 'uid', value: DataType.uid },
                                0x83: { name: 'trackType', value: DataType.uint },
                                0xb9: { name: 'flagEnabled', value: DataType.bool },
                                0x88: { name: 'flagDefault', value: DataType.bool },
                                0x55aa: { name: 'flagForced', value: DataType.bool }, // extended
                                0x9c: { name: 'flagLacing', value: DataType.bool },
                                0x6de7: { name: 'minCache', value: DataType.uint },
                                0x6de8: { name: 'maxCache', value: DataType.uint },
                                0x23e383: { name: 'defaultDuration', value: DataType.uint },
                                0x23314f: { name: 'timecodeScale', value: DataType.float },
                                0x536e: { name: 'name', value: DataType.string },
                                0x22b59c: { name: 'language', value: DataType.string },
                                0x86: { name: 'codecID', value: DataType.string },
                                0x63a2: { name: 'codecPrivate', value: DataType.binary },
                                0x258688: { name: 'codecName', value: DataType.string },
                                0x3a9697: { name: 'codecSettings', value: DataType.string },
                                0x3b4040: { name: 'codecInfoUrl', value: DataType.string },
                                0x26b240: { name: 'codecDownloadUrl', value: DataType.string },
                                0xaa: { name: 'codecDecodeAll', value: DataType.bool },
                                0x6fab: { name: 'trackOverlay', value: DataType.uint },
                                // Video
                                0xe0: {
                                    name: 'video',
                                    container: {
                                        0x9a: { name: 'flagInterlaced', value: DataType.bool },
                                        0x53b8: { name: 'stereoMode', value: DataType.uint },
                                        0xb0: { name: 'pixelWidth', value: DataType.uint },
                                        0xba: { name: 'pixelHeight', value: DataType.uint },
                                        0x54b0: { name: 'displayWidth', value: DataType.uint },
                                        0x54ba: { name: 'displayHeight', value: DataType.uint },
                                        0x54b3: { name: 'aspectRatioType', value: DataType.uint },
                                        0x2eb524: { name: 'colourSpace', value: DataType.uint },
                                        0x2fb523: { name: 'gammaValue', value: DataType.float }
                                    }
                                },
                                // Audio
                                0xe1: {
                                    name: 'audio',
                                    container: {
                                        0xb5: { name: 'samplingFrequency', value: DataType.float },
                                        0x78b5: { name: 'outputSamplingFrequency', value: DataType.float },
                                        0x9f: { name: 'channels', value: DataType.uint }, // https://www.matroska.org/technical/specs/index.html
                                        0x94: { name: 'channels', value: DataType.uint },
                                        0x7d7b: { name: 'channelPositions', value: DataType.binary },
                                        0x6264: { name: 'bitDepth', value: DataType.uint }
                                    }
                                },
                                // Content Encoding
                                0x6d80: {
                                    name: 'contentEncodings',
                                    container: {
                                        0x6240: {
                                            name: 'contentEncoding',
                                            container: {
                                                0x5031: { name: 'order', value: DataType.uint },
                                                0x5032: { name: 'scope', value: DataType.bool },
                                                0x5033: { name: 'type', value: DataType.uint },
                                                0x5034: {
                                                    name: 'contentEncoding',
                                                    container: {
                                                        0x4254: { name: 'contentCompAlgo', value: DataType.uint },
                                                        0x4255: { name: 'contentCompSettings', value: DataType.binary }
                                                    }
                                                },
                                                0x5035: {
                                                    name: 'contentEncoding',
                                                    container: {
                                                        0x47e1: { name: 'contentEncAlgo', value: DataType.uint },
                                                        0x47e2: { name: 'contentEncKeyID', value: DataType.binary },
                                                        0x47e3: { name: 'contentSignature ', value: DataType.binary },
                                                        0x47e4: { name: 'ContentSigKeyID  ', value: DataType.binary },
                                                        0x47e5: { name: 'contentSigAlgo ', value: DataType.uint },
                                                        0x47e6: { name: 'contentSigHashAlgo ', value: DataType.uint }
                                                    }
                                                },
                                                0x6264: { name: 'bitDepth', value: DataType.uint }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Cueing Data
                0x1c53bb6b: {
                    name: 'cues',
                    container: {
                        0xbb: {
                            name: 'cuePoint',
                            container: {
                                0xb3: { name: 'cueTime', value: DataType.uid },
                                0xb7: {
                                    name: 'positions',
                                    container: {
                                        0xf7: { name: 'track', value: DataType.uint },
                                        0xf1: { name: 'clusterPosition', value: DataType.uint },
                                        0x5378: { name: 'blockNumber', value: DataType.uint },
                                        0xea: { name: 'codecState', value: DataType.uint },
                                        0xdb: {
                                            name: 'reference', container: {
                                                0x96: { name: 'time', value: DataType.uint },
                                                0x97: { name: 'cluster', value: DataType.uint },
                                                0x535f: { name: 'number', value: DataType.uint },
                                                0xeb: { name: 'codecState', value: DataType.uint }
                                            }
                                        },
                                        0xf0: { name: 'relativePosition', value: DataType.uint } // extended
                                    }
                                }
                            }
                        }
                    }
                },
                // Attachment
                0x1941a469: {
                    name: 'attachments',
                    container: {
                        0x61a7: {
                            name: 'attachedFiles',
                            multiple: true,
                            container: {
                                0x467e: { name: 'description', value: DataType.string },
                                0x466e: { name: 'name', value: DataType.string },
                                0x4660: { name: 'mimeType', value: DataType.string },
                                0x465c: { name: 'data', value: DataType.binary },
                                0x46ae: { name: 'uid', value: DataType.uid }
                            }
                        }
                    }
                },
                // Chapters
                0x1043a770: {
                    name: 'chapters',
                    container: {
                        0x45b9: {
                            name: 'editionEntry',
                            container: {
                                0xb6: {
                                    name: 'chapterAtom',
                                    container: {
                                        0x73c4: { name: 'uid', value: DataType.uid },
                                        0x91: { name: 'timeStart', value: DataType.uint },
                                        0x92: { name: 'timeEnd', value: DataType.uid },
                                        0x98: { name: 'hidden', value: DataType.bool },
                                        0x4598: { name: 'enabled', value: DataType.uid },
                                        0x8f: {
                                            name: 'track', container: {
                                                0x89: { name: 'trackNumber', value: DataType.uid },
                                                0x80: {
                                                    name: 'display', container: {
                                                        0x85: { name: 'string', value: DataType.string },
                                                        0x437c: { name: 'language ', value: DataType.string },
                                                        0x437e: { name: 'country ', value: DataType.string }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                // Tagging
                0x1254c367: {
                    name: 'tags',
                    container: {
                        0x7373: {
                            name: 'tag',
                            multiple: true,
                            container: {
                                0x63c0: {
                                    name: 'target',
                                    container: {
                                        0x63c5: { name: 'tagTrackUID', value: DataType.uid },
                                        0x63c4: { name: 'tagChapterUID', value: DataType.uint },
                                        0x63c6: { name: 'tagAttachmentUID', value: DataType.uid },
                                        0x63ca: { name: 'targetType', value: DataType.string }, // extended
                                        0x68ca: { name: 'targetTypeValue', value: DataType.uint }, // extended
                                        0x63c9: { name: 'tagEditionUID', value: DataType.uid } // extended
                                    }
                                },
                                0x67c8: {
                                    name: 'simpleTags',
                                    multiple: true,
                                    container: {
                                        0x45a3: { name: 'name', value: DataType.string },
                                        0x4487: { name: 'string', value: DataType.string },
                                        0x4485: { name: 'binary', value: DataType.binary },
                                        0x447a: { name: 'language', value: DataType.string }, // extended
                                        0x447b: { name: 'languageIETF', value: DataType.string }, // extended
                                        0x4484: { name: 'default', value: DataType.bool } // extended
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
