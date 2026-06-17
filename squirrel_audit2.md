# squirrelscan Audit Report

**URL:** https://zapatillasmay.mx  
**Date:** 2026-06-17T12:10:48.396Z  
**Pages:** 30  
**Version:** 0.0.38

## Health Score

| Category | Score |
|----------|-------|
| **Overall** | **68/100 (D)** |
| Accessibility | 90/100 |
| Crawlability | 93/100 |
| Performance | 87/100 |
| Security | 91/100 |
| Content | 84/100 |
| Mobile | 88/100 |
| URL Structure | 92/100 |
| Core SEO | 93/100 |
| Images | 98/100 |
| E-E-A-T | 62/100 |
| Links | 94/100 |
| Analytics | 100/100 |
| Internationalization | 100/100 |
| Legal Compliance | 100/100 |
| Local SEO | 100/100 |
| Structured Data | 100/100 |
| Social Media | 100/100 |

## Summary

- **Passed:** 3085
- **Warnings:** 352
- **Failed:** 39

---

## Issues

### Crawlability

*1 error(s), 1 warning(s)*

#### Sitemap Valid **[ERROR]**

`crawl/sitemap-valid`

> Validates sitemap structure and URL limits

**Solution:**

Sitemaps must follow the sitemap protocol: use UTF-8 encoding, proper XML structure, and valid URLs. Each sitemap file can contain max 50,000 URLs and be max 50MB uncompressed. For larger sites, use a sitemap index file. All URLs should return 200 status codes. Use lastmod dates to indicate content freshness. Compress with gzip for faster loading.

| Check | Status | Message |
|-------|--------|---------|
| sitemap-syntax | X fail | 7 error(s) in 7 sitemap(s) |

<details><summary><strong>sitemap-syntax:</strong> 7 item(s)</summary>

- [Unknown sitemap format](https://zapatillasmay.mx/sitemap_index.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/sitemap-index.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/sitemaps.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/sitemap1.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/post-sitemap.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/page-sitemap.xml)
- [Unknown sitemap format](https://zapatillasmay.mx/news-sitemap.xml)

</details>

---

#### Sitemap Coverage **[WARN]**

`crawl/sitemap-coverage`

> Checks for indexable pages that are not in the sitemap

**Solution:**

Your sitemap should include all pages you want search engines to index. Pages that are crawlable and indexable (no noindex, not blocked by robots.txt) should generally be in your sitemap. Missing pages may not be discovered or indexed efficiently. Use a sitemap generator that automatically includes all indexable pages, or manually add important pages.

| Check | Status | Message |
|-------|--------|---------|
| sitemap-orphans | ! warn | 206 sitemap URL(s) were not crawled |

<details><summary><strong>sitemap-orphans:</strong> 206 item(s)</summary>

- [https://zapatillasmay.mx/ofertas](https://zapatillasmay.mx/ofertas)
- [https://zapatillasmay.mx/nosotros](https://zapatillasmay.mx/nosotros)
- [https://zapatillasmay.mx/envios](https://zapatillasmay.mx/envios)
- [https://zapatillasmay.mx/contacto](https://zapatillasmay.mx/contacto)
- [https://zapatillasmay.mx/privacidad](https://zapatillasmay.mx/privacidad)
- [https://zapatillasmay.mx/politica-de-devoluciones](https://zapatillasmay.mx/politica-de-devoluciones)
- [https://zapatillasmay.mx/tabla-tallas](https://zapatillasmay.mx/tabla-tallas)
- [https://zapatillasmay.mx/como-comprar](https://zapatillasmay.mx/como-comprar)
- [https://zapatillasmay.mx/producto/M-TAC-0022](https://zapatillasmay.mx/producto/M-TAC-0022)
- [https://zapatillasmay.mx/producto/O-TAC-0118](https://zapatillasmay.mx/producto/O-TAC-0118)
- [https://zapatillasmay.mx/producto/M-TAC-0030](https://zapatillasmay.mx/producto/M-TAC-0030)
- [https://zapatillasmay.mx/producto/M-TAC-0038](https://zapatillasmay.mx/producto/M-TAC-0038)
- [https://zapatillasmay.mx/producto/D-TAC-0081](https://zapatillasmay.mx/producto/D-TAC-0081)
- [https://zapatillasmay.mx/producto/E-TAC-0057](https://zapatillasmay.mx/producto/E-TAC-0057)
- [https://zapatillasmay.mx/producto/R-TAC-0115](https://zapatillasmay.mx/producto/R-TAC-0115)
- [https://zapatillasmay.mx/producto/R-TAC-0132](https://zapatillasmay.mx/producto/R-TAC-0132)
- [https://zapatillasmay.mx/producto/M-TAC-0033](https://zapatillasmay.mx/producto/M-TAC-0033)
- [https://zapatillasmay.mx/producto/C-TAC-0052](https://zapatillasmay.mx/producto/C-TAC-0052)
- [https://zapatillasmay.mx/producto/C-TAC-0054](https://zapatillasmay.mx/producto/C-TAC-0054)
- [https://zapatillasmay.mx/producto/I-TAC-0209](https://zapatillasmay.mx/producto/I-TAC-0209)
- [https://zapatillasmay.mx/producto/I-TAC-0153](https://zapatillasmay.mx/producto/I-TAC-0153)
- [https://zapatillasmay.mx/producto/M-TAC-0031](https://zapatillasmay.mx/producto/M-TAC-0031)
- [https://zapatillasmay.mx/producto/M-SAN-0037](https://zapatillasmay.mx/producto/M-SAN-0037)
- [https://zapatillasmay.mx/producto/S-TAC-0181](https://zapatillasmay.mx/producto/S-TAC-0181)
- [https://zapatillasmay.mx/producto/M-SAN-0002](https://zapatillasmay.mx/producto/M-SAN-0002)
- [https://zapatillasmay.mx/producto/J-TAC-0071](https://zapatillasmay.mx/producto/J-TAC-0071)
- [https://zapatillasmay.mx/producto/J-TAC-0141](https://zapatillasmay.mx/producto/J-TAC-0141)
- [https://zapatillasmay.mx/producto/C-TAC-0015](https://zapatillasmay.mx/producto/C-TAC-0015)
- [https://zapatillasmay.mx/producto/I-TAC-0093](https://zapatillasmay.mx/producto/I-TAC-0093)
- [https://zapatillasmay.mx/producto/M-SAN-0123](https://zapatillasmay.mx/producto/M-SAN-0123)
- [https://zapatillasmay.mx/producto/E-TAC-0058](https://zapatillasmay.mx/producto/E-TAC-0058)
- [https://zapatillasmay.mx/producto/A-TAC-0094](https://zapatillasmay.mx/producto/A-TAC-0094)
- [https://zapatillasmay.mx/producto/W-TAC-0170](https://zapatillasmay.mx/producto/W-TAC-0170)
- [https://zapatillasmay.mx/producto/J-TAC-0065](https://zapatillasmay.mx/producto/J-TAC-0065)
- [https://zapatillasmay.mx/producto/E-BTN-0137](https://zapatillasmay.mx/producto/E-BTN-0137)
- [https://zapatillasmay.mx/producto/M-TAC-0128](https://zapatillasmay.mx/producto/M-TAC-0128)
- [https://zapatillasmay.mx/producto/O-TAC-0178](https://zapatillasmay.mx/producto/O-TAC-0178)
- [https://zapatillasmay.mx/producto/S-TAC-0184](https://zapatillasmay.mx/producto/S-TAC-0184)
- [https://zapatillasmay.mx/producto/O-TAC-0092](https://zapatillasmay.mx/producto/O-TAC-0092)
- [https://zapatillasmay.mx/producto/C-TAC-0010](https://zapatillasmay.mx/producto/C-TAC-0010)
- [https://zapatillasmay.mx/producto/S-TAC-0134](https://zapatillasmay.mx/producto/S-TAC-0134)
- [https://zapatillasmay.mx/producto/C-TAC-0053](https://zapatillasmay.mx/producto/C-TAC-0053)
- [https://zapatillasmay.mx/producto/R-TAC-0131](https://zapatillasmay.mx/producto/R-TAC-0131)
- [https://zapatillasmay.mx/producto/F-TAC-0138](https://zapatillasmay.mx/producto/F-TAC-0138)
- [https://zapatillasmay.mx/producto/M-TAC-0145](https://zapatillasmay.mx/producto/M-TAC-0145)
- [https://zapatillasmay.mx/producto/O-TAC-0045](https://zapatillasmay.mx/producto/O-TAC-0045)
- [https://zapatillasmay.mx/producto/J-TAC-0078](https://zapatillasmay.mx/producto/J-TAC-0078)
- [https://zapatillasmay.mx/producto/J-TAC-0063](https://zapatillasmay.mx/producto/J-TAC-0063)
- [https://zapatillasmay.mx/producto/M-TAC-0122](https://zapatillasmay.mx/producto/M-TAC-0122)
- [https://zapatillasmay.mx/producto/J-TAC-0163](https://zapatillasmay.mx/producto/J-TAC-0163)
- [https://zapatillasmay.mx/producto/M-TAC-0121](https://zapatillasmay.mx/producto/M-TAC-0121)
- [https://zapatillasmay.mx/producto/C-TAC-0012](https://zapatillasmay.mx/producto/C-TAC-0012)
- [https://zapatillasmay.mx/producto/O-TAC-0043](https://zapatillasmay.mx/producto/O-TAC-0043)
- [https://zapatillasmay.mx/producto/M-TAC-0124](https://zapatillasmay.mx/producto/M-TAC-0124)
- [https://zapatillasmay.mx/producto/P-TAC-0179](https://zapatillasmay.mx/producto/P-TAC-0179)
- [https://zapatillasmay.mx/producto/M-TAC-0119](https://zapatillasmay.mx/producto/M-TAC-0119)
- [https://zapatillasmay.mx/producto/J-TAC-0156](https://zapatillasmay.mx/producto/J-TAC-0156)
- [https://zapatillasmay.mx/producto/O-TAC-0117](https://zapatillasmay.mx/producto/O-TAC-0117)
- [https://zapatillasmay.mx/producto/R-TAC-0194](https://zapatillasmay.mx/producto/R-TAC-0194)
- [https://zapatillasmay.mx/producto/M-TAC-0040](https://zapatillasmay.mx/producto/M-TAC-0040)
- [https://zapatillasmay.mx/producto/I-TAC-0201](https://zapatillasmay.mx/producto/I-TAC-0201)
- [https://zapatillasmay.mx/producto/C-TAC-0060](https://zapatillasmay.mx/producto/C-TAC-0060)
- [https://zapatillasmay.mx/producto/M-TAC-0150](https://zapatillasmay.mx/producto/M-TAC-0150)
- [https://zapatillasmay.mx/producto/E-TAC-0059](https://zapatillasmay.mx/producto/E-TAC-0059)
- [https://zapatillasmay.mx/producto/D-TAC-0136](https://zapatillasmay.mx/producto/D-TAC-0136)
- [https://zapatillasmay.mx/producto/J-BTN-0142](https://zapatillasmay.mx/producto/J-BTN-0142)
- [https://zapatillasmay.mx/producto/M-TAC-0034](https://zapatillasmay.mx/producto/M-TAC-0034)
- [https://zapatillasmay.mx/producto/M-TAC-0129](https://zapatillasmay.mx/producto/M-TAC-0129)
- [https://zapatillasmay.mx/producto/O-TAC-0046](https://zapatillasmay.mx/producto/O-TAC-0046)
- [https://zapatillasmay.mx/producto/J-TAC-0253](https://zapatillasmay.mx/producto/J-TAC-0253)
- [https://zapatillasmay.mx/producto/M-TAC-0164](https://zapatillasmay.mx/producto/M-TAC-0164)
- [https://zapatillasmay.mx/producto/M-TAC-0126](https://zapatillasmay.mx/producto/M-TAC-0126)
- [https://zapatillasmay.mx/producto/V-TAC-0187](https://zapatillasmay.mx/producto/V-TAC-0187)
- [https://zapatillasmay.mx/producto/E-TAC-0239](https://zapatillasmay.mx/producto/E-TAC-0239)
- [https://zapatillasmay.mx/producto/D-TAC-0079](https://zapatillasmay.mx/producto/D-TAC-0079)
- [https://zapatillasmay.mx/producto/M-TAC-0027](https://zapatillasmay.mx/producto/M-TAC-0027)
- [https://zapatillasmay.mx/producto/M-TAC-0101](https://zapatillasmay.mx/producto/M-TAC-0101)
- [https://zapatillasmay.mx/producto/J-TAC-0070](https://zapatillasmay.mx/producto/J-TAC-0070)
- [https://zapatillasmay.mx/producto/R-TAC-0149](https://zapatillasmay.mx/producto/R-TAC-0149)
- [https://zapatillasmay.mx/producto/V-TAC-0186](https://zapatillasmay.mx/producto/V-TAC-0186)
- [https://zapatillasmay.mx/producto/R-TAC-0167](https://zapatillasmay.mx/producto/R-TAC-0167)
- [https://zapatillasmay.mx/producto/S-TAC-0161](https://zapatillasmay.mx/producto/S-TAC-0161)
- [https://zapatillasmay.mx/producto/C-TAC-0008](https://zapatillasmay.mx/producto/C-TAC-0008)
- [https://zapatillasmay.mx/producto/J-TAC-0062](https://zapatillasmay.mx/producto/J-TAC-0062)
- [https://zapatillasmay.mx/producto/M-TAC-0143](https://zapatillasmay.mx/producto/M-TAC-0143)
- [https://zapatillasmay.mx/producto/O-TAC-0047](https://zapatillasmay.mx/producto/O-TAC-0047)
- [https://zapatillasmay.mx/producto/M-BTN-0135](https://zapatillasmay.mx/producto/M-BTN-0135)
- [https://zapatillasmay.mx/producto/M-TAC-0103](https://zapatillasmay.mx/producto/M-TAC-0103)
- [https://zapatillasmay.mx/producto/D-TAC-0086](https://zapatillasmay.mx/producto/D-TAC-0086)
- [https://zapatillasmay.mx/producto/M-TAC-0125](https://zapatillasmay.mx/producto/M-TAC-0125)
- [https://zapatillasmay.mx/producto/M-TAC-0039](https://zapatillasmay.mx/producto/M-TAC-0039)
- [https://zapatillasmay.mx/producto/C-TAC-0049](https://zapatillasmay.mx/producto/C-TAC-0049)
- [https://zapatillasmay.mx/producto/M-BTN-0231](https://zapatillasmay.mx/producto/M-BTN-0231)
- [https://zapatillasmay.mx/producto/O-TAC-0041](https://zapatillasmay.mx/producto/O-TAC-0041)
- [https://zapatillasmay.mx/producto/M-TAC-0097](https://zapatillasmay.mx/producto/M-TAC-0097)
- [https://zapatillasmay.mx/producto/M-TAC-0075](https://zapatillasmay.mx/producto/M-TAC-0075)
- [https://zapatillasmay.mx/producto/R-TAC-0159](https://zapatillasmay.mx/producto/R-TAC-0159)
- [https://zapatillasmay.mx/producto/D-TAC-0171](https://zapatillasmay.mx/producto/D-TAC-0171)
- [https://zapatillasmay.mx/producto/M-TAC-0175](https://zapatillasmay.mx/producto/M-TAC-0175)
- [https://zapatillasmay.mx/producto/I-TAC-0162](https://zapatillasmay.mx/producto/I-TAC-0162)
- [https://zapatillasmay.mx/producto/S-TAC-0228](https://zapatillasmay.mx/producto/S-TAC-0228)
- [https://zapatillasmay.mx/producto/C-TAC-0051](https://zapatillasmay.mx/producto/C-TAC-0051)
- [https://zapatillasmay.mx/producto/C-TAC-0048](https://zapatillasmay.mx/producto/C-TAC-0048)
- [https://zapatillasmay.mx/producto/J-BTN-0155](https://zapatillasmay.mx/producto/J-BTN-0155)
- [https://zapatillasmay.mx/producto/I-TAC-0152](https://zapatillasmay.mx/producto/I-TAC-0152)
- [https://zapatillasmay.mx/producto/O-TAC-0176](https://zapatillasmay.mx/producto/O-TAC-0176)
- [https://zapatillasmay.mx/producto/I-TAC-0151](https://zapatillasmay.mx/producto/I-TAC-0151)
- [https://zapatillasmay.mx/producto/M-TAC-0222](https://zapatillasmay.mx/producto/M-TAC-0222)
- [https://zapatillasmay.mx/producto/M-TAC-0035](https://zapatillasmay.mx/producto/M-TAC-0035)
- [https://zapatillasmay.mx/producto/M-TAC-0099](https://zapatillasmay.mx/producto/M-TAC-0099)
- [https://zapatillasmay.mx/producto/M-TAC-0120](https://zapatillasmay.mx/producto/M-TAC-0120)
- [https://zapatillasmay.mx/producto/S-TAC-0188](https://zapatillasmay.mx/producto/S-TAC-0188)
- [https://zapatillasmay.mx/producto/M-TAC-0130](https://zapatillasmay.mx/producto/M-TAC-0130)
- [https://zapatillasmay.mx/producto/G-TAC-0068](https://zapatillasmay.mx/producto/G-TAC-0068)
- [https://zapatillasmay.mx/producto/C-TAC-0013](https://zapatillasmay.mx/producto/C-TAC-0013)
- [https://zapatillasmay.mx/producto/M-TAC-0088](https://zapatillasmay.mx/producto/M-TAC-0088)
- [https://zapatillasmay.mx/producto/C-TAC-0005](https://zapatillasmay.mx/producto/C-TAC-0005)
- [https://zapatillasmay.mx/producto/D-BTN-0234](https://zapatillasmay.mx/producto/D-BTN-0234)
- [https://zapatillasmay.mx/producto/M-TAC-0127](https://zapatillasmay.mx/producto/M-TAC-0127)
- [https://zapatillasmay.mx/producto/J-TAC-0061](https://zapatillasmay.mx/producto/J-TAC-0061)
- [https://zapatillasmay.mx/producto/M-TAC-0244](https://zapatillasmay.mx/producto/M-TAC-0244)
- [https://zapatillasmay.mx/producto/F-TAC-0139](https://zapatillasmay.mx/producto/F-TAC-0139)
- [https://zapatillasmay.mx/producto/V-TAC-0185](https://zapatillasmay.mx/producto/V-TAC-0185)
- [https://zapatillasmay.mx/producto/M-TAC-0196](https://zapatillasmay.mx/producto/M-TAC-0196)
- [https://zapatillasmay.mx/producto/M-SAN-0148](https://zapatillasmay.mx/producto/M-SAN-0148)
- [https://zapatillasmay.mx/producto/D-TAC-0082](https://zapatillasmay.mx/producto/D-TAC-0082)
- [https://zapatillasmay.mx/producto/Q-TAC-0180](https://zapatillasmay.mx/producto/Q-TAC-0180)
- [https://zapatillasmay.mx/producto/M-TAC-0102](https://zapatillasmay.mx/producto/M-TAC-0102)
- [https://zapatillasmay.mx/producto/M-TAC-0028](https://zapatillasmay.mx/producto/M-TAC-0028)
- [https://zapatillasmay.mx/producto/V-TAC-0232](https://zapatillasmay.mx/producto/V-TAC-0232)
- [https://zapatillasmay.mx/producto/M-TAC-0158](https://zapatillasmay.mx/producto/M-TAC-0158)
- [https://zapatillasmay.mx/producto/M-TAC-0191](https://zapatillasmay.mx/producto/M-TAC-0191)
- [https://zapatillasmay.mx/producto/R-TAC-0133](https://zapatillasmay.mx/producto/R-TAC-0133)
- [https://zapatillasmay.mx/producto/D-TAC-0211](https://zapatillasmay.mx/producto/D-TAC-0211)
- [https://zapatillasmay.mx/producto/M-TAC-0098](https://zapatillasmay.mx/producto/M-TAC-0098)
- [https://zapatillasmay.mx/producto/C-TAC-0016](https://zapatillasmay.mx/producto/C-TAC-0016)
- [https://zapatillasmay.mx/producto/S-SAN-0229](https://zapatillasmay.mx/producto/S-SAN-0229)
- [https://zapatillasmay.mx/producto/M-TAC-0157](https://zapatillasmay.mx/producto/M-TAC-0157)
- [https://zapatillasmay.mx/producto/F-TAC-0250](https://zapatillasmay.mx/producto/F-TAC-0250)
- [https://zapatillasmay.mx/producto/D-TAC-0087](https://zapatillasmay.mx/producto/D-TAC-0087)
- [https://zapatillasmay.mx/producto/J-TAC-0174](https://zapatillasmay.mx/producto/J-TAC-0174)
- [https://zapatillasmay.mx/producto/J-TAC-0172](https://zapatillasmay.mx/producto/J-TAC-0172)
- [https://zapatillasmay.mx/producto/I-TAC-0198](https://zapatillasmay.mx/producto/I-TAC-0198)
- [https://zapatillasmay.mx/producto/F-BTN-0140](https://zapatillasmay.mx/producto/F-BTN-0140)
- [https://zapatillasmay.mx/producto/M-SAN-0225](https://zapatillasmay.mx/producto/M-SAN-0225)
- [https://zapatillasmay.mx/producto/G-FLT-0067](https://zapatillasmay.mx/producto/G-FLT-0067)
- [https://zapatillasmay.mx/producto/M-TAC-0100](https://zapatillasmay.mx/producto/M-TAC-0100)
- [https://zapatillasmay.mx/producto/J-TAC-0154](https://zapatillasmay.mx/producto/J-TAC-0154)
- [https://zapatillasmay.mx/producto/D-TAC-0168](https://zapatillasmay.mx/producto/D-TAC-0168)
- [https://zapatillasmay.mx/producto/R-TAC-0193](https://zapatillasmay.mx/producto/R-TAC-0193)
- [https://zapatillasmay.mx/producto/M-TAC-0165](https://zapatillasmay.mx/producto/M-TAC-0165)
- [https://zapatillasmay.mx/producto/M-TAC-0190](https://zapatillasmay.mx/producto/M-TAC-0190)
- [https://zapatillasmay.mx/producto/O-TAC-0044](https://zapatillasmay.mx/producto/O-TAC-0044)
- [https://zapatillasmay.mx/producto/O-TAC-0042](https://zapatillasmay.mx/producto/O-TAC-0042)
- [https://zapatillasmay.mx/producto/M-TAC-0166](https://zapatillasmay.mx/producto/M-TAC-0166)
- [https://zapatillasmay.mx/producto/W-TAC-0252](https://zapatillasmay.mx/producto/W-TAC-0252)
- [https://zapatillasmay.mx/producto/R-TAC-0160](https://zapatillasmay.mx/producto/R-TAC-0160)
- [https://zapatillasmay.mx/producto/M-TAC-0227](https://zapatillasmay.mx/producto/M-TAC-0227)
- [https://zapatillasmay.mx/producto/O-TAC-0177](https://zapatillasmay.mx/producto/O-TAC-0177)
- [https://zapatillasmay.mx/producto/J-TAC-0173](https://zapatillasmay.mx/producto/J-TAC-0173)
- [https://zapatillasmay.mx/producto/J-TAC-0076](https://zapatillasmay.mx/producto/J-TAC-0076)
- [https://zapatillasmay.mx/producto/J-TAC-0249](https://zapatillasmay.mx/producto/J-TAC-0249)
- [https://zapatillasmay.mx/producto/D-PLT-0109](https://zapatillasmay.mx/producto/D-PLT-0109)
- [https://zapatillasmay.mx/producto/M-TAC-0217](https://zapatillasmay.mx/producto/M-TAC-0217)
- [https://zapatillasmay.mx/producto/J-TAC-0066](https://zapatillasmay.mx/producto/J-TAC-0066)
- [https://zapatillasmay.mx/producto/L-TAC-0230](https://zapatillasmay.mx/producto/L-TAC-0230)
- [https://zapatillasmay.mx/producto/C-TAC-0009](https://zapatillasmay.mx/producto/C-TAC-0009)
- [https://zapatillasmay.mx/producto/J-TAC-0074](https://zapatillasmay.mx/producto/J-TAC-0074)
- [https://zapatillasmay.mx/producto/M-TAC-0223](https://zapatillasmay.mx/producto/M-TAC-0223)
- [https://zapatillasmay.mx/producto/J-TAC-0073](https://zapatillasmay.mx/producto/J-TAC-0073)
- [https://zapatillasmay.mx/producto/D-TAC-0213](https://zapatillasmay.mx/producto/D-TAC-0213)
- [https://zapatillasmay.mx/producto/C-TAC-0011](https://zapatillasmay.mx/producto/C-TAC-0011)
- [https://zapatillasmay.mx/producto/M-TAC-0199](https://zapatillasmay.mx/producto/M-TAC-0199)
- [https://zapatillasmay.mx/producto/J-TAC-0203](https://zapatillasmay.mx/producto/J-TAC-0203)
- [https://zapatillasmay.mx/producto/F-BTN-0240](https://zapatillasmay.mx/producto/F-BTN-0240)
- [https://zapatillasmay.mx/producto/D-SAN-0084](https://zapatillasmay.mx/producto/D-SAN-0084)
- [https://zapatillasmay.mx/producto/M-TAC-0248](https://zapatillasmay.mx/producto/M-TAC-0248)
- [https://zapatillasmay.mx/producto/M-TAC-0241](https://zapatillasmay.mx/producto/M-TAC-0241)
- [https://zapatillasmay.mx/producto/D-TAC-0214](https://zapatillasmay.mx/producto/D-TAC-0214)
- [https://zapatillasmay.mx/producto/M-TAC-0221](https://zapatillasmay.mx/producto/M-TAC-0221)
- [https://zapatillasmay.mx/producto/M-TAC-0195](https://zapatillasmay.mx/producto/M-TAC-0195)
- [https://zapatillasmay.mx/producto/D-TAC-0212](https://zapatillasmay.mx/producto/D-TAC-0212)
- [https://zapatillasmay.mx/producto/M-TAC-0200](https://zapatillasmay.mx/producto/M-TAC-0200)
- [https://zapatillasmay.mx/producto/M-BTN-0245](https://zapatillasmay.mx/producto/M-BTN-0245)
- [https://zapatillasmay.mx/producto/S-TAC-0219](https://zapatillasmay.mx/producto/S-TAC-0219)
- [https://zapatillasmay.mx/producto/D-TAC-0236](https://zapatillasmay.mx/producto/D-TAC-0236)
- [https://zapatillasmay.mx/producto/J-TAC-0220](https://zapatillasmay.mx/producto/J-TAC-0220)
- [https://zapatillasmay.mx/producto/J-TAC-0251](https://zapatillasmay.mx/producto/J-TAC-0251)
- [https://zapatillasmay.mx/producto/M-TAC-0091](https://zapatillasmay.mx/producto/M-TAC-0091)
- [https://zapatillasmay.mx/producto/M-TAC-0197](https://zapatillasmay.mx/producto/M-TAC-0197)
- [https://zapatillasmay.mx/producto/M-TAC-0243](https://zapatillasmay.mx/producto/M-TAC-0243)
- [https://zapatillasmay.mx/producto/D-TAC-0215](https://zapatillasmay.mx/producto/D-TAC-0215)
- [https://zapatillasmay.mx/producto/M-TAC-0246](https://zapatillasmay.mx/producto/M-TAC-0246)
- [https://zapatillasmay.mx/producto/M-BTN-0233](https://zapatillasmay.mx/producto/M-BTN-0233)
- [https://zapatillasmay.mx/producto/D-TAC-0238](https://zapatillasmay.mx/producto/D-TAC-0238)
- [https://zapatillasmay.mx/producto/M-TAC-0216](https://zapatillasmay.mx/producto/M-TAC-0216)
- [https://zapatillasmay.mx/producto/C-TAC-0202](https://zapatillasmay.mx/producto/C-TAC-0202)
- [https://zapatillasmay.mx/producto/D-TAC-0237](https://zapatillasmay.mx/producto/D-TAC-0237)
- [https://zapatillasmay.mx/producto/M-SAN-0242](https://zapatillasmay.mx/producto/M-SAN-0242)
- [https://zapatillasmay.mx/producto/D-TAC-0218](https://zapatillasmay.mx/producto/D-TAC-0218)
- [https://zapatillasmay.mx/producto/R-TAC-0114](https://zapatillasmay.mx/producto/R-TAC-0114)
- [https://zapatillasmay.mx/producto/M-TAC-0255](https://zapatillasmay.mx/producto/M-TAC-0255)
- [https://zapatillasmay.mx/producto/D-TAC-0235](https://zapatillasmay.mx/producto/D-TAC-0235)
- [https://zapatillasmay.mx/producto/J-TAC-0205](https://zapatillasmay.mx/producto/J-TAC-0205)
- [https://zapatillasmay.mx/producto/M-TAC-0116](https://zapatillasmay.mx/producto/M-TAC-0116)
- [https://zapatillasmay.mx/producto/M-TAC-0189](https://zapatillasmay.mx/producto/M-TAC-0189)

</details>

---

### Core SEO

*0 error(s), 14 warning(s)*

#### Meta Title **[ERROR]**

`core/meta-title`

> Validates page title presence and length

**Solution:**

Every page needs a unique, descriptive title tag between 30-60 characters. Titles appear in browser tabs, search results, and social shares. Write titles that accurately describe the page content while including your primary keyword near the beginning. If your title is too short, add more descriptive context. If too long, prioritize the most important information first and trim secondary details. Avoid keyword stuffing or duplicate titles across pages.

| Check | Status | Message |
|-------|--------|---------|
| meta-title | ! warn | Title too long |
| meta-title | ! warn | Title too short |

<details><summary><strong>meta-title:</strong> 2 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)

</details>

<details><summary><strong>meta-title:</strong> 2 item(s)</summary>

- [Zapatillas May | Calzado de Moda Mayoreo y Menudeo (69 chars)](https://zapatillasmay.mx/)
- [Mayoreo de Calzado sin Mínimo — desde 3 Pares | Za (62 chars)](https://zapatillasmay.mx/mayoreo)

</details>

<details><summary><strong>meta-title:</strong> 5 page(s) affected</summary>

- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)

</details>

<details><summary><strong>meta-title:</strong> 5 item(s)</summary>

- [M | Zapatillas May (18 chars)](https://zapatillasmay.mx/producto/M-TAC-0146)
- [E | Zapatillas May (18 chars)](https://zapatillasmay.mx/producto/E-TAC-0056)
- [D | Zapatillas May (18 chars)](https://zapatillasmay.mx/producto/D-TAC-0080)
- [O | Zapatillas May (18 chars)](https://zapatillasmay.mx/producto/O-TAC-0206)
- [M | Zapatillas May (18 chars)](https://zapatillasmay.mx/producto/M-TAC-0144)

</details>

---

#### H1 Tag **[ERROR]**

`core/h1`

> Validates H1 tag presence and uniqueness

**Solution:**

Each page should have exactly one H1 tag that clearly describes the main topic. The H1 is the primary heading users and search engines see, and it should align with the page title while being more detailed. If missing, add an H1 at the top of your main content. If you have multiple H1s, demote extras to H2 or lower. Ensure the H1 is descriptive and contains relevant keywords naturally.

| Check | Status | Message |
|-------|--------|---------|
| h1 | ! warn | Multiple H1 tags found (2) |

<details><summary><strong>h1:</strong> 1 page(s) affected</summary>

- [/mayoreo](https://zapatillasmay.mx/mayoreo)

</details>

<details><summary><strong>h1:</strong> 1 item(s)</summary>

- [Multiple H1 tags found (2)](https://zapatillasmay.mx/mayoreo)

</details>

---

#### Meta Description **[ERROR]**

`core/meta-description`

> Validates meta description presence and length

**Solution:**

Meta descriptions should be 120-160 characters and provide a compelling summary of the page. While not a direct ranking factor, good descriptions improve click-through rates from search results. Write unique descriptions for each page that accurately preview the content. Include a call-to-action when appropriate. If missing, search engines will auto-generate snippets which may not represent your page optimally.

| Check | Status | Message |
|-------|--------|---------|
| meta-description | ! warn | Description too long |
| meta-description | ! warn | Description too short |

<details><summary><strong>meta-description:</strong> 1 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)

</details>

<details><summary><strong>meta-description:</strong> 1 item(s)</summary>

- [Calzado femenino de moda fabricado en León, Guanaj (161 chars)](https://zapatillasmay.mx/)

</details>

<details><summary><strong>meta-description:</strong> 4 page(s) affected</summary>

- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)

</details>

<details><summary><strong>meta-description:</strong> 4 item(s)</summary>

- [Botas de moda para dama fabricadas en León, Guanaj (113 chars)](https://zapatillasmay.mx/botas)
- [Botines de moda para dama hechos en León, Guanajua (109 chars)](https://zapatillasmay.mx/botines)
- [Tacones aguja de 10cm en sintético para fiesta. Có (115 chars)](https://zapatillasmay.mx/producto/C-TAC-0207)
- [ZAPATILLA DE DAMA PARA FIESTA MUY ELEGANTES CON TA (60 chars)](https://zapatillasmay.mx/producto/C-TAC-0014)

</details>

---

#### Title Uniqueness **[WARN]**

`core/title-unique`

> Checks that page titles are unique across the site

**Solution:**

Each page should have a unique title that accurately describes its content. Duplicate titles confuse search engines and users about which page to display. Use a pattern like 'Page Topic | Brand Name' to ensure uniqueness. CMS often generate duplicate titles - audit and customize them.

| Check | Status | Message |
|-------|--------|---------|
| title-unique | ! warn | 1 duplicate title(s) affecting 2 pages |

<details><summary><strong>title-unique:</strong> 1 item(s)</summary>

- "m | zapatillas may..." (2 pages)
  - from: [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
  - from: [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)

</details>

---

### Security

*0 error(s), 32 warning(s)*

#### Content Security Policy **[WARN]**

`security/csp`

> Checks for Content-Security-Policy header and validates directives

**Solution:**

CSP prevents XSS attacks by restricting which resources can load. Start with a report-only policy to identify issues. Key directives: default-src 'self', script-src (avoid 'unsafe-inline'), img-src, style-src, frame-ancestors. Use nonces or hashes instead of 'unsafe-inline' for scripts. Test thoroughly as strict CSP can break functionality.

| Check | Status | Message |
|-------|--------|---------|
| csp-unsafe-scripts | ! warn | CSP allows 'unsafe-inline' and 'unsafe-eval' |

---

#### HTTP to HTTPS Redirect **[WARN]**

`security/http-to-https`

> Checks whether HTTP URLs redirect to HTTPS

**Solution:**

Ensure all HTTP URLs redirect to their HTTPS equivalents using permanent (301) redirects. This consolidates link equity and avoids mixed indexing. Configure your server to enforce HTTPS globally and verify that both the homepage and key internal URLs redirect correctly. WARNING: This rule makes external HTTP requests to probe redirect behavior.

| Check | Status | Message |
|-------|--------|---------|
| http-to-https | ! warn | 20 HTTP URL(s) redirect to HTTPS |

<details><summary><strong>http-to-https:</strong> 20 item(s)</summary>

- [http://zapatillasmay.mx/ → https://zapatillasmay.mx/ (308)](http://zapatillasmay.mx/)
- [http://zapatillasmay.mx/mayoreo → https://zapatillasmay.mx/mayoreo (308)](http://zapatillasmay.mx/mayoreo)
- [http://zapatillasmay.mx/sandalias → https://zapatillasmay.mx/sandalias (308)](http://zapatillasmay.mx/sandalias)
- [http://zapatillasmay.mx/tacones → https://zapatillasmay.mx/tacones (308)](http://zapatillasmay.mx/tacones)
- [http://zapatillasmay.mx/flats → https://zapatillasmay.mx/flats (308)](http://zapatillasmay.mx/flats)
- [http://zapatillasmay.mx/plataformas → https://zapatillasmay.mx/plataformas (308)](http://zapatillasmay.mx/plataformas)
- [http://zapatillasmay.mx/botas → https://zapatillasmay.mx/botas (308)](http://zapatillasmay.mx/botas)
- [http://zapatillasmay.mx/botines → https://zapatillasmay.mx/botines (308)](http://zapatillasmay.mx/botines)
- [http://zapatillasmay.mx/producto/C-TAC-0207 → https://zapatillasmay.mx/producto/C-TAC-0207 (308)](http://zapatillasmay.mx/producto/C-TAC-0207)
- [http://zapatillasmay.mx/producto/C-TAC-0014 → https://zapatillasmay.mx/producto/C-TAC-0014 (308)](http://zapatillasmay.mx/producto/C-TAC-0014)
- [http://zapatillasmay.mx/producto/M-BTN-0247 → https://zapatillasmay.mx/producto/M-BTN-0247 (308)](http://zapatillasmay.mx/producto/M-BTN-0247)
- [http://zapatillasmay.mx/producto/M-TAC-0146 → https://zapatillasmay.mx/producto/M-TAC-0146 (308)](http://zapatillasmay.mx/producto/M-TAC-0146)
- [http://zapatillasmay.mx/producto/I-TAC-0208 → https://zapatillasmay.mx/producto/I-TAC-0208 (308)](http://zapatillasmay.mx/producto/I-TAC-0208)
- [http://zapatillasmay.mx/producto/C-TAC-0050 → https://zapatillasmay.mx/producto/C-TAC-0050 (308)](http://zapatillasmay.mx/producto/C-TAC-0050)
- [http://zapatillasmay.mx/producto/J-FLT-0254 → https://zapatillasmay.mx/producto/J-FLT-0254 (308)](http://zapatillasmay.mx/producto/J-FLT-0254)
- [http://zapatillasmay.mx/producto/E-TAC-0056 → https://zapatillasmay.mx/producto/E-TAC-0056 (308)](http://zapatillasmay.mx/producto/E-TAC-0056)
- [http://zapatillasmay.mx/producto/M-TAC-0019 → https://zapatillasmay.mx/producto/M-TAC-0019 (308)](http://zapatillasmay.mx/producto/M-TAC-0019)
- [http://zapatillasmay.mx/producto/M-TAC-0032 → https://zapatillasmay.mx/producto/M-TAC-0032 (308)](http://zapatillasmay.mx/producto/M-TAC-0032)
- [http://zapatillasmay.mx/producto/M-TAC-0106 → https://zapatillasmay.mx/producto/M-TAC-0106 (308)](http://zapatillasmay.mx/producto/M-TAC-0106)
- [http://zapatillasmay.mx/producto/D-TAC-0085 → https://zapatillasmay.mx/producto/D-TAC-0085 (308)](http://zapatillasmay.mx/producto/D-TAC-0085)

</details>

---

#### Third-Party Cookies *[INFO]*

`security/third-party-cookies`

> Detects third-party resources that may set cookies

**Solution:**

Third-party cookies are being phased out by browsers. Review resources from external domains that may set cookies for tracking. Consider using first-party analytics solutions, server-side tracking, or privacy-focused alternatives. Ensure compliance with GDPR/CCPA by providing cookie consent and disclosing third-party services in your privacy policy.

| Check | Status | Message |
|-------|--------|---------|
| tracking-domains | ! warn | 1 known tracking domain(s) detected |

<details><summary><strong>tracking-domains:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>tracking-domains:</strong> 1 item(s)</summary>

- www.googletagmanager.com (script)

</details>

---

### Links

*0 error(s), 1 warning(s)*

#### Orphan Pages **[WARN]**

`links/orphan-pages`

> Detects pages with no internal links pointing to them

**Solution:**

Orphan pages have no internal links and are hard for search engines to discover. They may not get indexed or rank well. Add internal links from relevant pages. Include in navigation or sidebar. Add to sitemap. Create contextual links from related content. If intentionally orphaned (e.g., landing pages), ensure they're accessible via sitemap.

| Check | Status | Message |
|-------|--------|---------|
| orphan-pages | ! warn | 23 orphan page(s) with <2 incoming links |

<details><summary><strong>orphan-pages:</strong> 23 item(s)</summary>

- [https://zapatillasmay.mx/flats](https://zapatillasmay.mx/flats)
- [https://zapatillasmay.mx/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [https://zapatillasmay.mx/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [https://zapatillasmay.mx/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [https://zapatillasmay.mx/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [https://zapatillasmay.mx/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [https://zapatillasmay.mx/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [https://zapatillasmay.mx/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [https://zapatillasmay.mx/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [https://zapatillasmay.mx/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [https://zapatillasmay.mx/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [https://zapatillasmay.mx/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [https://zapatillasmay.mx/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [https://zapatillasmay.mx/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [https://zapatillasmay.mx/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [https://zapatillasmay.mx/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [https://zapatillasmay.mx/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [https://zapatillasmay.mx/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [https://zapatillasmay.mx/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [https://zapatillasmay.mx/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [https://zapatillasmay.mx/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [https://zapatillasmay.mx/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [https://zapatillasmay.mx/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

---

### Content

*0 error(s), 28 warning(s)*

#### Duplicate Title **[WARN]**

`content/duplicate-title`

> Checks for duplicate title tags across the site

**Solution:**

Each page should have a unique title tag that accurately describes its content. Duplicate titles confuse search engines about which page to rank and make your pages less distinguishable in search results. Use unique, descriptive titles that include relevant keywords. For similar pages (e.g., pagination), add differentiating elements like page numbers or category names.

| Check | Status | Message |
|-------|--------|---------|
| duplicate-title | ! warn | 1 duplicate title(s) found across 2 pages |

<details><summary><strong>duplicate-title:</strong> 1 item(s)</summary>

- "m | zapatillas may..." (2 pages)
  - from: [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
  - from: [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)

</details>

---

#### Heading Hierarchy **[WARN]**

`content/heading-hierarchy`

> Validates heading structure and hierarchy

**Solution:**

Proper heading structure (H1 → H2 → H3) helps users and search engines understand your content organization. Skipping levels (H1 → H3) creates confusion. Use headings in sequential order without skipping levels. Each section should use the next heading level down. Think of headings as an outline—they should make sense when read alone. Avoid empty headings or using headings purely for styling.

| Check | Status | Message |
|-------|--------|---------|
| empty-headings | ! warn | 1 empty heading(s) found |

<details><summary><strong>empty-headings:</strong> 8 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)

</details>

<details><summary><strong>empty-headings:</strong> 8 item(s)</summary>

- [1 empty heading(s) found](https://zapatillasmay.mx/)
- [1 empty heading(s) found](https://zapatillasmay.mx/mayoreo)
- [1 empty heading(s) found](https://zapatillasmay.mx/sandalias)
- [1 empty heading(s) found](https://zapatillasmay.mx/tacones)
- [1 empty heading(s) found](https://zapatillasmay.mx/flats)
- [1 empty heading(s) found](https://zapatillasmay.mx/plataformas)
- [1 empty heading(s) found](https://zapatillasmay.mx/botas)
- [1 empty heading(s) found](https://zapatillasmay.mx/botines)

</details>

---

#### Keyword Stuffing **[WARN]**

`content/keyword-stuffing`

> Detects excessive keyword repetition in content

**Solution:**

Keyword stuffing is repeating words unnaturally to manipulate rankings. Search engines penalize this practice. Write naturally for users first. Use keywords where they fit naturally. Aim for 1-2% keyword density at most. Use synonyms and related terms instead of repeating the exact same phrase. Focus on providing value, not gaming algorithms.

| Check | Status | Message |
|-------|--------|---------|
| keyword-stuffing | ! warn | N word(s) may be overused |

<details><summary><strong>keyword-stuffing:</strong> 17 page(s) affected</summary>

- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>keyword-stuffing:</strong> 4 item(s)</summary>

- "charol" (5.1%)
- "talla" (3.4%)
- "para" (3.5%)
- "con" (3.1%)

</details>

---

#### Word Count **[WARN]**

`content/word-count`

> Checks content length for thin content issues

**Solution:**

Pages with thin content (under 300 words) often struggle to rank well and are actively deindexed by Google since the June 2025 core update. Add more valuable, relevant content to thin pages—aim for at least 500 words for standard pages and 1000+ for in-depth articles. If a page can't be fleshed out, voluntarily noindex it or consolidate it into a more comprehensive resource. Trimming thin pages from your index is better than leaving low-value content for Google to penalize.

| Check | Status | Message |
|-------|--------|---------|
| word-count | ! warn | Thin content: N words (min N) |

<details><summary><strong>word-count:</strong> 2 page(s) affected</summary>

- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)

</details>

<details><summary><strong>word-count:</strong> 2 item(s)</summary>

- [Thin content: 289 words (min 300)](https://zapatillasmay.mx/producto/M-BTN-0247)
- [Thin content: 290 words (min 300)](https://zapatillasmay.mx/producto/I-TAC-0208)

</details>

---

### Images

*0 error(s), 8 warning(s)*

#### Offscreen Image Lazy Loading **[WARN]**

`images/offscreen-lazy`

> Checks if offscreen images use lazy loading

**Solution:**

Add loading='lazy' to images below the fold to defer loading until needed. This reduces initial page load time and saves bandwidth. Exception: Don't lazy-load LCP image or above-the-fold content. Use loading='eager' for critical images.

| Check | Status | Message |
|-------|--------|---------|
| offscreen-images-not-lazy | ! warn | 1 below-fold image(s) without lazy loading |

<details><summary><strong>offscreen-images-not-lazy:</strong> 8 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)

</details>

<details><summary><strong>offscreen-images-not-lazy:</strong> 1 item(s)</summary>

- 

</details>

---

### Performance

*0 error(s), 131 warning(s)*

#### LCP Optimization Hints **[WARN]**

`perf/lcp-hints`

> Checks for Largest Contentful Paint optimization opportunities

**Solution:**

LCP measures when the largest content element becomes visible. Optimize by: 1) Preload your LCP image with <link rel='preload' as='image'>. 2) Don't use loading='lazy' on above-fold images as it delays loading. 3) Minimize render-blocking CSS/JS in <head>. 4) Use modern image formats (WebP/AVIF) for faster loading. 5) Consider using fetchpriority='high' on the LCP image.

| Check | Status | Message |
|-------|--------|---------|
| lcp-preload | ! warn | N potential LCP image(s) without preload |

<details><summary><strong>lcp-preload:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>lcp-preload:</strong> 4 item(s)</summary>

- [https://res.cloudinary.com/dybdtehhs/image/upload/w_120,f_auto,q_auto/v1780174687/Pngtree_womens_red_transparent_high_heels_9062648_gffufl.png](https://res.cloudinary.com/dybdtehhs/image/upload/w_120,f_auto,q_auto/v1780174687/Pngtree_womens_red_transparent_high_heels_9062648_gffufl.png)
- [https://res.cloudinary.com/dybdtehhs/image/upload/w_480,f_auto,q_auto/v1776836428/Proyecto_nuevo_wpdwus.png](https://res.cloudinary.com/dybdtehhs/image/upload/w_480,f_auto,q_auto/v1776836428/Proyecto_nuevo_wpdwus.png)
- [https://res.cloudinary.com/dybdtehhs/image/upload/w_900,f_auto,q_auto/v1/zapatillasmay/hero-zapato](https://res.cloudinary.com/dybdtehhs/image/upload/w_900,f_auto,q_auto/v1/zapatillasmay/hero-zapato)
- [https://res.cloudinary.com/dybdtehhs/image/upload/w_300,f_auto,q_auto/v1776836428/Proyecto_nuevo_wpdwus.png](https://res.cloudinary.com/dybdtehhs/image/upload/w_300,f_auto,q_auto/v1776836428/Proyecto_nuevo_wpdwus.png)

</details>

---

#### Time to First Byte **[WARN]**

`perf/ttfb`

> Measures server response time (TTFB)

**Solution:**

Time to First Byte (TTFB) measures how quickly your server responds. Slow TTFB indicates server/backend issues.

Thresholds (Core Web Vitals):
- Good: < 600ms
- Needs improvement: 600-1000ms
- Poor: > 1000ms

Fixes for slow TTFB:
- Enable server caching (Redis, Varnish, CDN)
- Optimize database queries
- Use CDN for static assets
- Upgrade server resources
- Reduce server-side processing
- Enable HTTP/2 or HTTP/3
- Use edge computing (Cloudflare Workers, Vercel Edge)

| Check | Status | Message |
|-------|--------|---------|
| ttfb | ! warn | Slow server response (Nms) |

<details><summary><strong>ttfb:</strong> 3 page(s) affected</summary>

- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)

</details>

<details><summary><strong>ttfb:</strong> 3 item(s)</summary>

- [Slow server response (969ms)](https://zapatillasmay.mx/mayoreo)
- [Slow server response (639ms)](https://zapatillasmay.mx/producto/C-TAC-0014)
- [Slow server response (610ms)](https://zapatillasmay.mx/producto/C-TAC-0050)

</details>

---

#### Critical Request Chains **[WARN]**

`perf/critical-request-chains`

> Identifies chains of dependent resources that delay rendering

**Solution:**

Critical request chains are sequences of dependent network requests that must complete before the page can render. Reduce chain depth by: 1) Inlining critical CSS instead of linking external files. 2) Adding async or defer to non-critical scripts. 3) Avoiding CSS @import — use <link> tags instead. 4) Using <link rel='preload'> for critical resources. 5) Reducing the number of render-blocking resources in <head>.

| Check | Status | Message |
|-------|--------|---------|
| critical-request-chains | ! warn | 1 critical request chain(s) found |

<details><summary><strong>critical-request-chains:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>critical-request-chains:</strong> 2 item(s)</summary>

- CSS: https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap
- CSS: https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap

</details>

---

#### Unminified JavaScript **[WARN]**

`perf/unminified-js`

> Detects unminified JavaScript that could be optimized

**Solution:**

Minify JavaScript to reduce file size and improve load times. Use build tools like Terser, esbuild, or UglifyJS. Most bundlers (Webpack, Vite, Rollup) minify automatically in production. Minification shortens variable names, removes whitespace, and dead code.

| Check | Status | Message |
|-------|--------|---------|
| unminified-js | ! warn | 1 JavaScript file(s) appear unminified |

<details><summary><strong>unminified-js:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>unminified-js:</strong> 1 item(s)</summary>

- 6.5KB, ~2.0KB savings

</details>

---

#### Preconnect Hints *[INFO]*

`perf/preconnect`

> Checks for preconnect hints to critical third-party origins

**Solution:**

Preconnect establishes early connections to important third-party origins, saving time on DNS lookup, TCP handshake, and TLS negotiation. Add <link rel='preconnect' href='https://example.com'> for CDNs and critical third-party services. Use crossorigin attribute for CORS resources like fonts. Limit preconnects to 2-4 most critical origins to avoid connection congestion.

| Check | Status | Message |
|-------|--------|---------|
| preconnect-missing | ! warn | Missing preconnect for 1 CDN(s) |

<details><summary><strong>preconnect-missing:</strong> 8 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)

</details>

<details><summary><strong>preconnect-missing:</strong> 1 item(s)</summary>

- cdn.jsdelivr.net

</details>

---

#### Unminified CSS **[WARN]**

`perf/unminified-css`

> Detects unminified CSS that could be optimized

**Solution:**

Minify CSS to reduce file size and improve load times. Use build tools like cssnano, clean-css, or PostCSS with cssnano plugin. Most bundlers (Webpack, Vite, esbuild) can minify CSS automatically in production mode. Minification removes whitespace, comments, and optimizes syntax.

| Check | Status | Message |
|-------|--------|---------|
| unminified-css | ! warn | 1 CSS file(s) appear unminified |

<details><summary><strong>unminified-css:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>unminified-css:</strong> 1 item(s)</summary>

- 68.4KB, ~16.3KB savings

</details>

---

### Accessibility

*38 error(s), 90 warning(s)*

#### ARIA Dialog Name **[ERROR]**

`a11y/aria-dialog-name`

> Checks that dialog elements have accessible names

**Solution:**

Elements with role='dialog' or role='alertdialog' (and native <dialog>) must have an accessible name. Add aria-label with a descriptive label, or use aria-labelledby pointing to a visible heading inside the dialog. A title attribute also works but is less preferred. Without a name, screen reader users won't know the purpose of the dialog.

| Check | Status | Message |
|-------|--------|---------|
| aria-dialog-name | X fail | 1 ARIA dialog(s) without accessible names |

<details><summary><strong>aria-dialog-name:</strong> 8 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)

</details>

<details><summary><strong>aria-dialog-name:</strong> 1 item(s)</summary>

- dialog#modal-producto

</details>

---

#### Label Content Name Mismatch **[ERROR]**

`a11y/label-content-name-mismatch`

> Checks that visible label text is part of accessible name

**Solution:**

For controls with visible labels, the accessible name should contain the visible text. Voice control users say what they see - if the accessible name doesn't include the visible label, voice commands won't work. Example: A button showing 'Search' should not have aria-label='Find products'.

| Check | Status | Message |
|-------|--------|---------|
| label-content-name-mismatch | X fail | N element(s) where visible text doesn't match accessible name |

<details><summary><strong>label-content-name-mismatch:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>label-content-name-mismatch:</strong> 5 item(s)</summary>

- select: visible="relevancia precio: m" vs aria-label="ordenar productos"
- button: visible="✕" vs aria-label="cerrar"
- button: visible="✕" vs aria-label="cerrar"
- select: visible="menudeo y mayoreo va" vs aria-label="tipo de cuenta"
- button: visible="✕" vs aria-label="cerrar"

</details>

---

#### Color Contrast **[WARN]**

`a11y/color-contrast`

> Checks for color contrast issues in styles and classes

**Solution:**

Text must have sufficient contrast with its background for readability. WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18px+ or 14px+ bold). Use tools like WebAIM Contrast Checker to verify. Common issues: light gray text, text over images without overlay. Don't rely on color alone to convey information - add icons or text labels.

| Check | Status | Message |
|-------|--------|---------|
| color-contrast | ! warn | N potential color contrast issue(s) |

<details><summary><strong>color-contrast:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>color-contrast:</strong> 11 item(s)</summary>

- a: #C8967A on #F5ECE2 (2.22:1)
- a: white on #25D366 (1.98:1)
- Light gray text: 25 instance(s)
- White text (verify background): 59 instance(s)
- Very light text color: 3 instance(s)
- CSS rule ".product-price-before...": light gray text color
- CSS rule "/* ── COLOR / TALLA ── */
    ...": light gray text color
- CSS rule ".btn-agregar:disabled...": light gray text color
- Light gray text: 15 instance(s)
- White text (verify background): 12 instance(s)
- Very light text color: 4 instance(s)

</details>

---

#### Heading Order **[WARN]**

`a11y/heading-order`

> Checks that heading levels don't skip

**Solution:**

Headings should follow a logical hierarchy without skipping levels. Screen reader users navigate by headings, so skipping from H1 to H3 is confusing. Correct order: H1 -> H2 -> H3 (not H1 -> H3). You can have multiple headings at the same level, and you can go back up (H3 -> H2 is fine). Think of headings as an outline - they should make sense when read alone.

| Check | Status | Message |
|-------|--------|---------|
| heading-order | ! warn | 1 heading level skip(s) detected |

<details><summary><strong>heading-order:</strong> 8 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)

</details>

<details><summary><strong>heading-order:</strong> 1 item(s)</summary>

- H5 after H2

</details>

---

#### Link in Text Block **[WARN]**

`a11y/link-in-text-block`

> Checks that links in text blocks are visually distinguishable

**Solution:**

Links within text blocks must be distinguishable by more than just color (for color-blind users). Use underlines, bold, borders, or other visual indicators. Exception: Links can rely on color alone if the contrast ratio between link and surrounding text is at least 3:1 and you provide additional cues on hover/focus.

| Check | Status | Message |
|-------|--------|---------|
| link-in-text-block | ! warn | 4 link(s) in text may lack underlines |

<details><summary><strong>link-in-text-block:</strong> 22 page(s) affected</summary>

- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>link-in-text-block:</strong> 4 item(s)</summary>

- "→ Iniciar devolución por Whats..."
- "zapatillasmay.mx"
- "Política de privacidad"
- "Devoluciones"

</details>

---

#### Touch Targets **[WARN]**

`a11y/touch-targets`

> Checks for minimum touch target sizing hints

**Solution:**

Touch targets (buttons, links) should be at least 44x44 pixels for accessibility (WCAG 2.5.5) and usability. Increase size with padding rather than just increasing font size. Ensure at least 8px spacing between adjacent targets. For inline links in text, provide sufficient line-height. This helps users with motor impairments and improves mobile usability for everyone.

| Check | Status | Message |
|-------|--------|---------|
| touch-targets | ! warn | N element(s) with potentially small touch targets |

<details><summary><strong>touch-targets:</strong> 30 page(s) affected</summary>

- [/](https://zapatillasmay.mx/)
- [/mayoreo](https://zapatillasmay.mx/mayoreo)
- [/sandalias](https://zapatillasmay.mx/sandalias)
- [/tacones](https://zapatillasmay.mx/tacones)
- [/flats](https://zapatillasmay.mx/flats)
- [/plataformas](https://zapatillasmay.mx/plataformas)
- [/botas](https://zapatillasmay.mx/botas)
- [/botines](https://zapatillasmay.mx/botines)
- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>touch-targets:</strong> 30 item(s)</summary>

- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/mayoreo)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/sandalias)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/tacones)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/flats)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/plataformas)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/botas)
- [8 element(s) with potentially small touch targets](https://zapatillasmay.mx/botines)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/C-TAC-0207)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/C-TAC-0014)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-BTN-0247)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0146)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/I-TAC-0208)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/C-TAC-0050)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/J-FLT-0254)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/E-TAC-0056)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0019)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0032)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0106)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/D-TAC-0085)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0023)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/I-SAN-0096)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-SAN-0021)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/J-FLT-0108)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/E-TAC-0055)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0024)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/D-TAC-0080)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/O-TAC-0206)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/M-TAC-0144)
- [2 element(s) with potentially small touch targets](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

---

### Mobile

*0 error(s), 22 warning(s)*

#### Tap Targets **[WARN]**

`mobile/tap-targets`

> Checks for properly sized touch targets

**Solution:**

Touch targets (buttons, links) should be at least 44x44 CSS pixels with 8px spacing between them. This ensures users can tap accurately on mobile. Google's mobile-friendly test checks this. Use padding to increase tap area without changing visual size. Pay special attention to navigation links and form inputs.

| Check | Status | Message |
|-------|--------|---------|
| small-tap-targets | ! warn | 1 element(s) may have small tap targets |

<details><summary><strong>small-tap-targets:</strong> 22 page(s) affected</summary>

- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

<details><summary><strong>small-tap-targets:</strong> 22 item(s)</summary>

- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/C-TAC-0207)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/C-TAC-0014)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-BTN-0247)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0146)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/I-TAC-0208)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/C-TAC-0050)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/J-FLT-0254)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/E-TAC-0056)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0019)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0032)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0106)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/D-TAC-0085)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0023)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/I-SAN-0096)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-SAN-0021)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/J-FLT-0108)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/E-TAC-0055)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0024)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/D-TAC-0080)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/O-TAC-0206)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/M-TAC-0144)
- [1 element(s) may have small tap targets](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

---

### URL Structure

*0 error(s), 22 warning(s)*

#### URL Lowercase **[WARN]**

`url/lowercase`

> Checks that URLs are lowercase

**Solution:**

URLs should be lowercase to prevent duplicate content issues. Most servers treat /Page and /page as different URLs, creating duplicates. Always use lowercase URLs and redirect uppercase variants. Configure your server or CMS to auto-lowercase URLs. This also improves URL consistency and readability.

| Check | Status | Message |
|-------|--------|---------|
| url-lowercase | ! warn | URL contains uppercase characters |

<details><summary><strong>url-lowercase:</strong> 22 page(s) affected</summary>

- [/producto/C-TAC-0207](https://zapatillasmay.mx/producto/C-TAC-0207)
- [/producto/C-TAC-0014](https://zapatillasmay.mx/producto/C-TAC-0014)
- [/producto/M-BTN-0247](https://zapatillasmay.mx/producto/M-BTN-0247)
- [/producto/M-TAC-0146](https://zapatillasmay.mx/producto/M-TAC-0146)
- [/producto/I-TAC-0208](https://zapatillasmay.mx/producto/I-TAC-0208)
- [/producto/C-TAC-0050](https://zapatillasmay.mx/producto/C-TAC-0050)
- [/producto/J-FLT-0254](https://zapatillasmay.mx/producto/J-FLT-0254)
- [/producto/E-TAC-0056](https://zapatillasmay.mx/producto/E-TAC-0056)
- [/producto/M-TAC-0019](https://zapatillasmay.mx/producto/M-TAC-0019)
- [/producto/M-TAC-0032](https://zapatillasmay.mx/producto/M-TAC-0032)
- [/producto/M-TAC-0106](https://zapatillasmay.mx/producto/M-TAC-0106)
- [/producto/D-TAC-0085](https://zapatillasmay.mx/producto/D-TAC-0085)
- [/producto/M-TAC-0023](https://zapatillasmay.mx/producto/M-TAC-0023)
- [/producto/I-SAN-0096](https://zapatillasmay.mx/producto/I-SAN-0096)
- [/producto/M-SAN-0021](https://zapatillasmay.mx/producto/M-SAN-0021)
- [/producto/J-FLT-0108](https://zapatillasmay.mx/producto/J-FLT-0108)
- [/producto/E-TAC-0055](https://zapatillasmay.mx/producto/E-TAC-0055)
- [/producto/M-TAC-0024](https://zapatillasmay.mx/producto/M-TAC-0024)
- [/producto/D-TAC-0080](https://zapatillasmay.mx/producto/D-TAC-0080)
- [/producto/O-TAC-0206](https://zapatillasmay.mx/producto/O-TAC-0206)
- [/producto/M-TAC-0144](https://zapatillasmay.mx/producto/M-TAC-0144)
- [/producto/J-TAC-0064](https://zapatillasmay.mx/producto/J-TAC-0064)

</details>

---

### E-E-A-T

*0 error(s), 3 warning(s)*

#### About Page **[WARN]**

`eeat/about-page`

> Checks for an about/company page with content

**Solution:**

An About page establishes credibility and trust. Include company history, mission, team overview, and credentials. Link from main navigation or footer. For E-E-A-T, explain your expertise and why visitors should trust you. Include contact information and physical location if applicable.

| Check | Status | Message |
|-------|--------|---------|
| about-page | ! warn | No About page found |

---

#### Contact Page **[WARN]**

`eeat/contact-page`

> Checks for contact page with multiple contact methods

**Solution:**

A contact page with multiple contact methods builds trust. Include: email address or contact form, phone number (if applicable), physical address, and social media links. Make contact information easy to find from any page. For local businesses, include business hours. Response time expectations are also helpful.

| Check | Status | Message |
|-------|--------|---------|
| contact-page | ! warn | No Contact page found |

---

#### Privacy Policy **[WARN]**

`eeat/privacy-policy`

> Checks for privacy policy page linked from footer

**Solution:**

A privacy policy is required by law in many jurisdictions (GDPR, CCPA) and signals trustworthiness. Link it from your footer on every page. Cover: what data you collect, how you use it, third-party sharing, user rights, and contact for privacy concerns. Keep it updated when practices change.

| Check | Status | Message |
|-------|--------|---------|
| privacy-policy | ! warn | No Privacy Policy page found |

---

---

*Generated by [squirrelscan](https://squirrelscan.com) v0.0.38*