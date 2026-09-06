import os
import docx
from docx.shared import Pt, Cm, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_border(cell, **kwargs):
    """
    Set cell borders
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='000000', space='0')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, attr in [('val', 'w:val'), ('color', 'w:color'), ('sz', 'w:sz'), ('space', 'w:space')]:
                if key in edge_data:
                    element.set(qn(attr), str(edge_data[key]))
        elif edge in kwargs and kwargs[edge] is None:
            tag = 'w:{}'.format(edge)
            element = tcBorders.find(qn(tag))
            if element is not None:
                tcBorders.remove(element)

def apply_open_table_style(table, col_widths=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Remove default borders if any
    tblPr = table._tbl.tblPr
    tblBorders = tblPr.first_child_found_in("w:tblBorders")
    if tblBorders is not None:
        tblPr.remove(tblBorders)

    # Apply borders row by row
    row_count = len(table.rows)
    for r_idx, row in enumerate(table.rows):
        # Prevent row split across pages
        trPr = row._tr.get_or_add_trPr()
        trPr.append(OxmlElement('w:cantSplit'))
        
        # Header repeat on every page
        if r_idx == 0:
            trPr.append(OxmlElement('w:tblHeader'))

        for c_idx, cell in enumerate(row.cells):
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            if col_widths and c_idx < len(col_widths):
                cell.width = col_widths[c_idx]

            # Borders for open table
            border_kwargs = {
                'left': None,
                'right': None,
                'insideH': None,
                'insideV': None
            }
            if r_idx == 0:
                border_kwargs['top'] = {'val': 'single', 'sz': '8', 'color': '000000'}
                border_kwargs['bottom'] = {'val': 'single', 'sz': '8', 'color': '000000'}
            elif r_idx == row_count - 1:
                border_kwargs['top'] = None
                border_kwargs['bottom'] = {'val': 'single', 'sz': '8', 'color': '000000'}
            else:
                border_kwargs['top'] = None
                border_kwargs['bottom'] = None
            
            set_cell_border(cell, **border_kwargs)

def add_page_number_field(run):
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = "PAGE"
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')
    r = run._r
    r.append(fldChar1)
    r.append(instrText)
    r.append(fldChar2)
    r.append(fldChar3)

def create_proposal_docx(output_path="PROPOSAL_TUGAS_AKHIR_SMKN1_PAKUAN_RATU.docx"):
    doc = docx.Document()

    # Define normal styles
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)

    # 1. Setup section margins for Section 1 (Preliminary Pages)
    sec1 = doc.sections[0]
    sec1.top_margin = Cm(3.0)
    sec1.bottom_margin = Cm(3.0)
    sec1.left_margin = Cm(4.0)
    sec1.right_margin = Cm(3.0)
    sec1.page_width = Cm(21.0)
    sec1.page_height = Cm(29.7)

    footer1 = sec1.footer
    p_f1 = footer1.paragraphs[0]
    p_f1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_f1 = p_f1.add_run()
    run_f1.font.name = 'Times New Roman'
    run_f1.font.size = Pt(12)
    add_page_number_field(run_f1)

    pgNumType1 = OxmlElement('w:pgNumType')
    pgNumType1.set(qn('w:fmt'), 'lowerRoman')
    sec1._sectPr.append(pgNumType1)

    # Helper function for body paragraph
    def p_body(text, indent=True, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=0):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        if indent:
            p.paragraph_format.first_line_indent = Cm(1.27)
        else:
            p.paragraph_format.first_line_indent = Cm(0)
        
        # Parse bold & italic simple tags
        # Format: text can contain <b>, <i>, etc. or plain
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def p_heading_bab(bab_num, bab_title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(18)
        p.paragraph_format.first_line_indent = Cm(0)
        run1 = p.add_run(f"BAB {bab_num}\n{bab_title.upper()}")
        run1.bold = True
        run1.font.name = 'Times New Roman'
        run1.font.size = Pt(14)
        return p

    def p_subbab(num_title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.first_line_indent = Cm(0)
        run = p.add_run(num_title)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def p_sub_subbab(num_title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.first_line_indent = Cm(0)
        run = p.add_run(num_title)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def p_caption_table(table_num, table_title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.first_line_indent = Cm(0)
        run1 = p.add_run(f"Tabel {table_num}. ")
        run1.bold = True
        run1.font.name = 'Times New Roman'
        run1.font.size = Pt(11)
        run2 = p.add_run(table_title)
        run2.font.name = 'Times New Roman'
        run2.font.size = Pt(11)
        return p

    def p_caption_gambar(gambar_num, gambar_title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(12)
        p.paragraph_format.first_line_indent = Cm(0)
        run1 = p.add_run(f"Gambar {gambar_num}. ")
        run1.bold = True
        run1.font.name = 'Times New Roman'
        run1.font.size = Pt(11)
        run2 = p.add_run(gambar_title)
        run2.font.name = 'Times New Roman'
        run2.font.size = Pt(11)
        return p

    # =========================================================================
    # 1. HALAMAN JUDUL (KULIT LUAR)
    # =========================================================================
    p_cov = doc.add_paragraph()
    p_cov.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov.paragraph_format.line_spacing = 1.0
    p_cov.paragraph_format.space_before = Pt(0)
    p_cov.paragraph_format.space_after = Pt(18)
    run = p_cov.add_run("PENGEMBANGAN WEBSITE PROFIL DAN CONTENT MANAGEMENT SYSTEM (CMS) SMKN 1 PAKUAN RATU BERBASIS REACT DAN EXPRESS SEBAGAI MEDIA INFORMASI, PUBLIKASI, DAN DIGITALISASI IDENTITAS SEKOLAH")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)

    p_prop = doc.add_paragraph()
    p_prop.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_prop.paragraph_format.line_spacing = 1.0
    p_prop.paragraph_format.space_before = Pt(6)
    p_prop.paragraph_format.space_after = Pt(28)
    run = p_prop.add_run("(Proposal Tugas Akhir Mahasiswa)")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    p_oleh = doc.add_paragraph()
    p_oleh.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_oleh.paragraph_format.line_spacing = 1.0
    p_oleh.paragraph_format.space_before = Pt(0)
    p_oleh.paragraph_format.space_after = Pt(8)
    run = p_oleh.add_run("Oleh:\n\n[NAMA MAHASISWA]\nNPM. [NOMOR POKOK MAHASISWA]")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    # Logo Polinela
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(24)
    p_logo.paragraph_format.space_after = Pt(28)
    if os.path.exists("logo_polinela.png"):
        p_logo.add_run().add_picture("logo_polinela.png", width=Cm(4.0), height=Cm(3.6))

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.line_spacing = 1.15
    p_inst.paragraph_format.space_before = Pt(20)
    p_inst.paragraph_format.space_after = Pt(0)
    run = p_inst.add_run("JURUSAN EKONOMI DAN BISNIS\nPOLITEKNIK NEGERI LAMPUNG\nBANDAR LAMPUNG\n2026")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # 2. HALAMAN JUDUL (KULIT DALAM)
    # =========================================================================
    p_cov_in = doc.add_paragraph()
    p_cov_in.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_in.paragraph_format.line_spacing = 1.0
    p_cov_in.paragraph_format.space_before = Pt(0)
    p_cov_in.paragraph_format.space_after = Pt(20)
    run = p_cov_in.add_run("PENGEMBANGAN WEBSITE PROFIL DAN CONTENT MANAGEMENT SYSTEM (CMS) SMKN 1 PAKUAN RATU BERBASIS REACT DAN EXPRESS SEBAGAI MEDIA INFORMASI, PUBLIKASI, DAN DIGITALISASI IDENTITAS SEKOLAH")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(13)

    p_oleh_in = doc.add_paragraph()
    p_oleh_in.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_oleh_in.paragraph_format.line_spacing = 1.0
    p_oleh_in.paragraph_format.space_before = Pt(12)
    p_oleh_in.paragraph_format.space_after = Pt(24)
    run = p_oleh_in.add_run("Oleh:\n\n[NAMA MAHASISWA]\nNPM. [NOMOR POKOK MAHASISWA]")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    p_syarat = doc.add_paragraph()
    p_syarat.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_syarat.paragraph_format.line_spacing = 1.15
    p_syarat.paragraph_format.space_before = Pt(18)
    p_syarat.paragraph_format.space_after = Pt(24)
    run = p_syarat.add_run("Proposal Tugas Akhir Mahasiswa\nSebagai Salah Satu Syarat untuk Melaksanakan Penelitian Tugas Akhir\npada Program Studi Rekayasa Perangkat Lunak Terapan / Manajemen Informatika\nJurusan Ekonomi dan Bisnis")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    p_logo_in = doc.add_paragraph()
    p_logo_in.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo_in.paragraph_format.space_before = Pt(18)
    p_logo_in.paragraph_format.space_after = Pt(24)
    if os.path.exists("logo_polinela.png"):
        p_logo_in.add_run().add_picture("logo_polinela.png", width=Cm(4.0), height=Cm(3.6))

    p_inst_in = doc.add_paragraph()
    p_inst_in.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst_in.paragraph_format.line_spacing = 1.15
    p_inst_in.paragraph_format.space_before = Pt(16)
    p_inst_in.paragraph_format.space_after = Pt(0)
    run = p_inst_in.add_run("POLITEKNIK NEGERI LAMPUNG\nBANDAR LAMPUNG\n2026")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # 3. HALAMAN PENGESAHAN
    # =========================================================================
    p_sah = doc.add_paragraph()
    p_sah.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sah.paragraph_format.space_before = Pt(0)
    p_sah.paragraph_format.space_after = Pt(20)
    run = p_sah.add_run("HALAMAN PENGESAHAN")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    # Identitas pengesahan
    p_data = doc.add_paragraph()
    p_data.paragraph_format.line_spacing = 1.3
    p_data.paragraph_format.space_after = Pt(18)
    items = [
        ("1. Judul Tugas Akhir Mahasiswa", ": Pengembangan Website Profil dan Content Management System (CMS) SMKN 1 Pakuan Ratu Berbasis React dan Express sebagai Media Informasi, Publikasi, dan Digitalisasi Identitas Sekolah"),
        ("2. Nama Mahasiswa", ": [NAMA MAHASISWA]"),
        ("3. Nomor Pokok Mahasiswa", ": [NOMOR POKOK MAHASISWA]"),
        ("4. Program Studi", ": Rekayasa Perangkat Lunak Terapan / Manajemen Informatika"),
        ("5. Jurusan", ": Ekonomi dan Bisnis")
    ]
    for lbl, val in items:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        run_l = p.add_run(f"{lbl:<32} ")
        run_l.bold = False
        run_l.font.name = 'Times New Roman'
        run_l.font.size = Pt(11)
        run_v = p.add_run(val)
        run_v.font.name = 'Times New Roman'
        run_v.font.size = Pt(11)

    p_tgl = doc.add_paragraph()
    p_tgl.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_tgl.paragraph_format.space_before = Pt(14)
    p_tgl.paragraph_format.space_after = Pt(10)
    run = p_tgl.add_run("Bandar Lampung,                     2026\nMenyetujui,")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)

    # Table of signatures (Dosen I & II)
    tbl_sig = doc.add_table(rows=2, cols=2)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    apply_open_table_style(tbl_sig, [Cm(7.0), Cm(7.0)])
    
    cell_d1 = tbl_sig.rows[0].cells[0].paragraphs[0]
    cell_d1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = cell_d1.add_run("Dosen Pembimbing I,\n\n\n\n\n[Nama Dosen Pembimbing I, Gelar]\nNIP. [NIP Dosen Pembimbing I]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)

    cell_d2 = tbl_sig.rows[0].cells[1].paragraphs[0]
    cell_d2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = cell_d2.add_run("Dosen Pembimbing II,\n\n\n\n\n[Nama Dosen Pembimbing II, Gelar]\nNIP. [NIP Dosen Pembimbing II]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)

    # Empty row 2
    tbl_sig.rows[1].cells[0].paragraphs[0].text = ""
    tbl_sig.rows[1].cells[1].paragraphs[0].text = ""

    p_kj = doc.add_paragraph()
    p_kj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kj.paragraph_format.space_before = Pt(14)
    p_kj.paragraph_format.space_after = Pt(4)
    run = p_kj.add_run("Mengetahui,\nKetua Jurusan Ekonomi dan Bisnis,\n\n\n\n\n[Nama Ketua Jurusan, Gelar]\nNIP. [NIP Ketua Jurusan]")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)

    p_ujian = doc.add_paragraph()
    p_ujian.paragraph_format.space_before = Pt(10)
    p_ujian.paragraph_format.space_after = Pt(0)
    run = p_ujian.add_run("Tanggal Seminar Proposal : ........................................")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # 4. KATA PENGANTAR
    # =========================================================================
    p_kp = doc.add_paragraph()
    p_kp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kp.paragraph_format.space_before = Pt(0)
    p_kp.paragraph_format.space_after = Pt(18)
    run = p_kp.add_run("KATA PENGANTAR")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    p_body("Puji dan syukur penulis panjatkan ke hadirat Allah SWT yang telah melimpahkan rahmat, hidayah, serta kekuatan sehingga penulisan naskah Proposal Tugas Akhir dengan judul \"Pengembangan Website Profil dan Content Management System (CMS) SMKN 1 Pakuan Ratu Berbasis React dan Express sebagai Media Informasi, Publikasi, dan Digitalisasi Identitas Sekolah\" ini dapat diselesaikan dengan baik.")

    p_body("Proposal penelitian ini disusun sebagai salah satu syarat akademis dalam menyelesaikan kurikulum jenjang Diploma pada Jurusan Ekonomi dan Bisnis, Politeknik Negeri Lampung. Sistem yang diusulkan berfokus pada integrasi portal profil sekolah yang interaktif, responsif, berestetika modern editorial dengan sentuhan Glassmorphism (frosted glass), serta dilengkapi sistem Content Management System (CMS) yang aman dan berjenjang guna memudahkan pihak sekolah memperbarui informasi secara mandiri tanpa ketergantungan pada pengembang perangkat lunak.")

    p_body("Dalam penyusunan proposal ini, penulis memperoleh banyak dukungan, bimbingan, arahan, dan motivasi dari berbagai pihak. Oleh karena itu, dengan penuh kerendahan hati penulis mengucapkan rasa terima kasih yang setinggi-tingginya kepada:")

    penghargaan = [
        "Direktur Politeknik Negeri Lampung, beserta seluruh jajaran pimpinan yang telah menyediakan sarana dan prasarana pendukung kegiatan akademik.",
        "Ketua Jurusan Ekonomi dan Bisnis Politeknik Negeri Lampung, yang selalu memberikan arahan, motivasi, dan kebijakan yang mendukung penyelesaian studi mahasiswa.",
        "Ketua Program Studi, atas bimbingan tata tertib serta administrasi pelaksanaan tugas akhir.",
        "Dosen Pembimbing I dan Dosen Pembimbing II, yang telah meluangkan waktu, tenaga, serta memberikan bimbingan teknis, saran, dan koreksi berharga dalam penyempurnaan usulan penelitian ini.",
        "Kepala SMK Negeri 1 Pakuan Ratu beserta jajaran dewan guru dan staf kependidikan, yang telah memberikan izin observasi, data profil sekolah, serta kerja sama yang sangat baik.",
        "Orang tua dan keluarga tercinta, yang tiada henti memberikan doa tulus, kasih sayang, dan dukungan moril maupun materil.",
        "Rekan-rekan mahasiswa Program Studi Rekayasa Perangkat Lunak Terapan / Manajemen Informatika, atas kebersamaan, diskusi teknis, dan semangat saling mendukung."
    ]

    for idx, item in enumerate(penghargaan, 1):
        p_item = doc.add_paragraph()
        p_item.paragraph_format.line_spacing = 1.5
        p_item.paragraph_format.left_indent = Cm(1.27)
        p_item.paragraph_format.first_line_indent = Cm(-0.6)
        p_item.paragraph_format.space_after = Pt(2)
        r = p_item.add_run(f"{idx}. {item}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    p_body("Penulis menyadari bahwa usulan penelitian ini masih memiliki ruang untuk perbaikan. Oleh sebab itu, segala kritik dan saran konstruktif dari dosen penguji serta pembaca sangat diharapkan demi penyempurnaan sistem yang akan dibangun. Akhir kata, semoga proposal ini dapat terlaksana dengan lancar dan memberikan kontribusi nyata bagi pengembangan teknologi informasi di dunia pendidikan.")

    p_tutup = doc.add_paragraph()
    p_tutup.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_tutup.paragraph_format.space_before = Pt(14)
    p_tutup.paragraph_format.space_after = Pt(0)
    run = p_tutup.add_run("Bandar Lampung,               2026\nPenulis,\n\n\n\n[NAMA MAHASISWA]")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)

    doc.add_page_break()

    # =========================================================================
    # 5. DAFTAR ISI
    # =========================================================================
    p_di = doc.add_paragraph()
    p_di.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_di.paragraph_format.space_before = Pt(0)
    p_di.paragraph_format.space_after = Pt(18)
    run = p_di.add_run("DAFTAR ISI")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    daftar_isi_entries = [
        ("HALAMAN JUDUL (KULIT LUAR)", "i"),
        ("HALAMAN JUDUL (KULIT DALAM)", "ii"),
        ("HALAMAN PENGESAHAN", "iii"),
        ("KATA PENGANTAR", "iv"),
        ("DAFTAR ISI", "v"),
        ("DAFTAR TABEL", "vi"),
        ("DAFTAR GAMBAR", "vii"),
        ("I. PENDAHULUAN", "1"),
        ("   1.1 Latar Belakang", "1"),
        ("   1.2 Perumusan Masalah", "4"),
        ("   1.3 Tujuan Penelitian", "4"),
        ("   1.4 Kerangka Pemikiran", "5"),
        ("   1.5 Batasan Masalah", "7"),
        ("   1.6 Kontribusi Penelitian", "8"),
        ("II. TINJAUAN PUSTAKA", "10"),
        ("   2.1 Website Profil Sekolah dan Transformasi Digital Vokasi", "10"),
        ("   2.2 Content Management System (CMS) dan Alur Kerja Publikasi", "11"),
        ("   2.3 Role-Based Access Control (RBAC) dan Keamanan Aplikasi", "12"),
        ("   2.4 Desain Antarmuka Glassmorphism dan Pengalaman Pengguna", "14"),
        ("   2.5 Tinjauan Teknologi Pengembangan Sistem", "16"),
        ("       2.5.1 React 19 dan TypeScript", "16"),
        ("       2.5.2 Bundler Vite 6", "17"),
        ("       2.5.3 Tailwind CSS", "18"),
        ("       2.5.4 Node.js dan Express Framework", "18"),
        ("       2.5.5 Prisma ORM dan MySQL 8", "19"),
        ("       2.5.6 Pemrosesan Citra Digital Sharp Engine", "20"),
        ("       2.5.7 Manajemen Status (TanStack Query dan Zustand)", "21"),
        ("       2.5.8 Kriptografi Argon2id dan JSON Web Token", "22"),
        ("   2.6 Metode Pengujian Sistem", "23"),
        ("       2.6.1 Black Box Testing", "23"),
        ("       2.6.2 System Usability Scale (SUS)", "24"),
        ("III. METODE PELAKSANAAN", "25"),
        ("   3.1 Tempat dan Waktu Pelaksanaan", "25"),
        ("   3.2 Bahan dan Alat", "25"),
        ("       3.2.1 Perangkat Keras (Hardware)", "25"),
        ("       3.2.2 Perangkat Lunak (Software)", "26"),
        ("   3.3 Rancangan Penelitian dan Model Pengembangan Sistem", "27"),
        ("       3.3.1 Tahap Analisis Kebutuhan (Requirements)", "28"),
        ("       3.3.2 Tahap Perancangan Sistem dan Basis Data (Design)", "29"),
        ("       3.3.3 Tahap Implementasi Kode Program (Implementation)", "30"),
        ("       3.3.4 Tahap Pengujian Sistem (Verification / Testing)", "31"),
        ("       3.3.5 Tahap Penerapan dan Pemeliharaan (Deployment)", "32"),
        ("   3.4 Prosedur Pelaksanaan Proyek", "32"),
        ("   3.5 Parameter Pengamatan dan Pengujian", "34"),
        ("       3.5.1 Pengujian Fungsionalitas (Black Box)", "34"),
        ("       3.5.2 Pengujian Keamanan Siber (Security Assessment)", "36"),
        ("       3.5.3 Pengujian Kinerja dan Aksesibilitas (Lighthouse)", "37"),
        ("       3.5.4 Pengujian Penerimaan Pengguna (Usability Testing)", "38"),
        ("   3.6 Jadwal Pelaksanaan Penelitian", "39"),
        ("   3.7 Personalia Pelaksana Proyek", "40"),
        ("IV. RENCANA ANGGARAN BIAYA PENELITIAN", "41"),
        ("   4.1 Rekapitulasi Rencana Anggaran Biaya", "41"),
        ("   4.2 Rincian Alokasi Biaya", "41"),
        ("DAFTAR PUSTAKA", "44"),
        ("LAMPIRAN", "48")
    ]

    p_hdr = doc.add_paragraph()
    p_hdr.paragraph_format.line_spacing = 1.0
    p_hdr.paragraph_format.space_after = Pt(6)
    r_hdr1 = p_hdr.add_run("Judul")
    r_hdr1.bold = True
    r_hdr2 = p_hdr.add_run(f"{'Halaman':>70}")
    r_hdr2.bold = True

    for title, page in daftar_isi_entries:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_after = Pt(2)
        # Calculate dot leader
        dots_needed = max(3, 75 - len(title) - len(page))
        dots = " ." * (dots_needed // 2)
        r1 = p_row.add_run(title)
        if title.startswith("I.") or title.startswith("II.") or title.startswith("III.") or title.startswith("IV.") or title.startswith("DAFTAR"):
            r1.bold = True
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r2 = p_row.add_run(f" {dots} {page}")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # 6. DAFTAR TABEL & GAMBAR
    # =========================================================================
    p_dt = doc.add_paragraph()
    p_dt.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dt.paragraph_format.space_before = Pt(0)
    p_dt.paragraph_format.space_after = Pt(18)
    run = p_dt.add_run("DAFTAR TABEL")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    tabel_entries = [
        ("Tabel 1. Matriks Hak Akses Pengguna (Role-Based Access Control)", "13"),
        ("Tabel 2. Spesifikasi Perangkat Keras Pengembangan dan Server", "26"),
        ("Tabel 3. Spesifikasi Perangkat Lunak Sistem", "26"),
        ("Tabel 4. Rencana Kasus Uji Pengujian Fungsional (Black Box Testing)", "35"),
        ("Tabel 5. Matriks Parameter Evaluasi Keamanan Web (Security Checklist)", "37"),
        ("Tabel 6. Jadwal Rencana Pelaksanaan Proyek (Gantt Chart 6 Bulan)", "39"),
        ("Tabel 7. Susunan Personalia Tim Pelaksana Proyek", "40"),
        ("Tabel 8. Rekapitulasi Rencana Anggaran Biaya Proyek", "41"),
        ("Tabel 9. Rincian Anggaran Pembelian Perangkat Keras dan Lisensi", "42"),
        ("Tabel 10. Rincian Anggaran Operasional Riset dan Pengumpulan Data", "42"),
        ("Tabel 11. Rincian Anggaran Domain, Hosting VPS, dan Keamanan Cloud", "43"),
        ("Tabel 12. Rincian Anggaran Seminar, Uji Publik, dan Pelaporan", "43")
    ]

    for title, page in tabel_entries:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_after = Pt(3)
        dots_needed = max(3, 75 - len(title) - len(page))
        dots = " ." * (dots_needed // 2)
        r1 = p_row.add_run(title)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r2 = p_row.add_run(f" {dots} {page}")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)

    p_dg = doc.add_paragraph()
    p_dg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dg.paragraph_format.space_before = Pt(20)
    p_dg.paragraph_format.space_after = Pt(18)
    run = p_dg.add_run("DAFTAR GAMBAR")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    gambar_entries = [
        ("Gambar 1. Kerangka Pemikiran Pengembangan Sistem", "6"),
        ("Gambar 2. Diagram Alir Arsitektur Sistem Terintegrasi (High-Level Design)", "15"),
        ("Gambar 3. Diagram Alur Pengembangan Sistem Waterfall Model", "28"),
        ("Gambar 4. Diagram Use Case Modul Publik dan CMS Pengelola", "30"),
        ("Gambar 5. Diagram Hubungan Antarentitas Basis Data (ERD 16 Model)", "51"),
        ("Gambar 6. Desain Visual Antarmuka Beranda Portal Publik", "55"),
        ("Gambar 7. Desain Antarmuka Panel Kontrol CMS Admin", "56")
    ]

    for title, page in gambar_entries:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_after = Pt(3)
        dots_needed = max(3, 75 - len(title) - len(page))
        dots = " ." * (dots_needed // 2)
        r1 = p_row.add_run(title)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r2 = p_row.add_run(f" {dots} {page}")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)

    # Add section break for Main Body (arabic numbers at header right)
    from docx.enum.section import WD_SECTION
    sec2 = doc.add_section(WD_SECTION.NEW_PAGE)
    sec2.top_margin = Cm(3.0)
    sec2.bottom_margin = Cm(3.0)
    sec2.left_margin = Cm(4.0)
    sec2.right_margin = Cm(3.0)
    sec2.page_width = Cm(21.0)
    sec2.page_height = Cm(29.7)

    sec2.header.is_linked_to_previous = False
    sec2.footer.is_linked_to_previous = False

    header2 = sec2.header
    p_h2 = header2.paragraphs[0]
    p_h2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_h2 = p_h2.add_run()
    run_h2.font.name = 'Times New Roman'
    run_h2.font.size = Pt(12)
    add_page_number_field(run_h2)

    footer2 = sec2.footer
    footer2.paragraphs[0].text = ""

    pgNumType2 = OxmlElement('w:pgNumType')
    pgNumType2.set(qn('w:fmt'), 'decimal')
    pgNumType2.set(qn('w:start'), '1')
    sec2._sectPr.append(pgNumType2)

    # =========================================================================
    # BAB I. PENDAHULUAN
    # =========================================================================
    p_heading_bab("I", "PENDAHULUAN")

    p_subbab("1.1 Latar Belakang")
    p_body("Perkembangan teknologi informasi dan komunikasi di era digital telah mengubah secara mendasar lanskap penyebaran informasi dan interaksi institusional, tak terkecuali pada sektor pendidikan kejuruan (Sekolah Menengah Kejuruan/SMK). Institusi pendidikan dituntut untuk memiliki media digital resmi yang tidak hanya berperan sebagai papan pengumuman virtual, melainkan sebagai pusat komunikasi interaktif, etalase prestasi, media promosi keunggulan akademik dan vokasional, serta saluran transparansi publik.")

    p_body("SMK Negeri 1 Pakuan Ratu, yang berlokasi di Kecamatan Pakuan Ratu, Kabupaten Way Kanan, Provinsi Lampung, merupakan salah satu sekolah kejuruan rujukan di wilayah Way Kanan yang memiliki peran strategis dalam mencetak lulusan terampil dan siap kerja. Keunggulan khas SMKN 1 Pakuan Ratu ditopang oleh keberagaman 5 (lima) program keahlian yang diselenggarakan, yaitu: (1) Agribisnis Tanaman (Pertanian) yang mengintegrasikan teknik budidaya modern dan pertanian presisi; (2) Agribisnis Ternak (Peternakan) yang berfokus pada manajemen ternak dan bioteknologi pakan; (3) Akuntansi dan Bisnis Digital yang membekali siswa pada pembukuan modern, perpajakan, dan fintech; (4) Desain Komunikasi Visual (DKV) yang mengembangkan kompetensi visual grafis, multimedia, dan periklanan; serta (5) Teknik dan Bisnis Sepeda Motor (TBSM) yang mendalami mekanik roda dua, diagnostik sistem Electronic Fuel Injection (EFI), dan kewirausahaan bengkel.")

    p_body("Keberagaman program keahlian tersebut menjadi fondasi identitas sekolah yang dirumuskan ke dalam konsep: \"Berakar pada potensi, tumbuh menuju masa depan\". Konsep ini menyatukan potensi sumber daya alam agrikultur Way Kanan dengan akselerasi teknologi modern dan kreativitas siswa. Potensi ini sangat membutuhkan saluran publikasi digital yang memadai agar dapat diakses secara luas oleh masyarakat luas, calon peserta didik baru, orang tua siswa, dinas pendidikan, serta dunia usaha dan dunia industri (DUDI).")

    p_body("Akan tetapi, berdasarkan observasi dan studi pendahuluan di SMKN 1 Pakuan Ratu, pengelolaan informasi saat ini menghadapi berbagai tantangan krusial. Pertama, pengelolaan website sekolah terdahulu masih sangat bergantung pada pihak pengembang (programmer eksternal) karena bersifat hardcoded atau tidak memiliki Content Management System (CMS) yang ramah pengguna. Akibatnya, pembaruan warta berita, publikasi prestasi siswa, pengunggahan agenda kegiatan, dan pemutakhiran data profil guru mengalami keterlambatan yang signifikan.")

    p_body("Kedua, belum tersedianya tata kelola aset digital dan dokumentasi foto praktikum yang terstruktur. Foto-foto kegiatan yang diambil dari kamera ponsel cerdas kerap diunggah secara mentah tanpa proses kompresi, menyebabkan waktu muat (loading time) halaman web menjadi lambat pada koneksi seluler di kawasan rural. Di samping itu, berkas mentah tersebut masih memuat metadata Exchangeable Image File Format (EXIF) seperti data koordinat lokasi geografis (GPS) yang berpotensi menimbulkan kerentanan privasi institusi.")

    p_body("Ketiga, dari sisi antarmuka pengguna (User Interface/UI) dan pengalaman pengguna (User Experience/UX), portal web sekolah yang ada sering kali tampak kaku, tidak responsif terhadap peranti genggam, serta masih menggunakan dialog pop-up bawaan browser seperti native JavaScript alert() yang mengganggu kenyamanan pengguna. Dalam standar desain modern, dialog pop-up konvensional ini harus digantikan dengan Custom Toast Notification dan Modal Dialog yang estetis serta selaras dengan tema identitas visual.")

    p_body("Keempat, dari segi keamanan sistem siber, website sekolah rentan terhadap ancaman brute-force login, SQL injection, Cross-Site Scripting (XSS), serta manipulasi sesi. Oleh karenanya, dibutuhkan rancangan arsitektur keamanan bertingkat (defense in depth) yang mencakup hashing kata sandi mutakhir berbasis Argon2id, tokenisasi sesi berbasis HttpOnly cookie, validasi skema data Zod, dan pembatasan laju permintaan (rate limiting).")

    p_body("Berdasarkan permasalahan-permasalahan tersebut, diajukan penelitian tugas akhir yang berjudul: \"Pengembangan Website Profil dan Content Management System (CMS) SMKN 1 Pakuan Ratu Berbasis React dan Express sebagai Media Informasi, Publikasi, dan Digitalisasi Identitas Sekolah\". Penelitian ini menghasilkan solusi rekayasa perangkat lunak terintegrasi yang menyatukan portal publik berestetika modern editorial dan Glassmorphism dengan panel admin CMS berjenjang yang aman, responsif, dan mudah dioperasikan.")

    p_subbab("1.2 Perumusan Masalah")
    p_body("Berdasarkan latar belakang yang telah dipaparkan, rumusan masalah dalam penelitian tugas akhir ini adalah:", indent=False)
    
    masalah_list = [
        "Bagaimana merancang dan membangun website profil publik SMKN 1 Pakuan Ratu yang modern, informatif, dan responsif dengan menerapkan gaya desain Glassmorphism untuk merepresentasikan 5 program keahlian vokasi?",
        "Bagaimana merancang dan mengimplementasikan sistem Content Management System (CMS) terintegrasi berbasis Role-Based Access Control (RBAC) agar staf sekolah dapat mengelola konten berita, agenda, prestasi, galeri, dan profil mandiri tanpa ketergantungan pada programmer?",
        "Bagaimana mengintegrasikan pipa pemrosesan citra otomatis menggunakan pustaka Sharp untuk mengonversi gambar ke format WebP dan menghapus metadata EXIF guna mengoptimalkan kecepatan akses dan privasi?",
        "Bagaimana menerapkan arsitektur keamanan berlapis (defense in depth) mencakup enkripsi Argon2id, JWT HttpOnly cookie, sanitasi input XSS, dan rate limiter pada sistem SMKN 1 Pakuan Ratu?",
        "Bagaimana menguji kelayakan dan performa sistem menggunakan metode pengujian otomatis Vitest, Black Box Testing, serta evaluasi kepuasan pengguna menggunakan kuesioner System Usability Scale (SUS)?"
    ]
    for idx, m in enumerate(masalah_list, 1):
        p_item = doc.add_paragraph()
        p_item.paragraph_format.line_spacing = 1.5
        p_item.paragraph_format.left_indent = Cm(1.27)
        p_item.paragraph_format.first_line_indent = Cm(-0.6)
        p_item.paragraph_format.space_after = Pt(2)
        r = p_item.add_run(f"{idx}. {m}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    p_subbab("1.3 Tujuan Penelitian")
    p_body("Tujuan Umum:", indent=False)
    p_body("Menghasilkan sistem website profil sekolah dan platform Content Management System (CMS) terintegrasi untuk SMKN 1 Pakuan Ratu yang aman, modern, berkinerja tinggi, dan mandiri guna mendukung publikasi dan digitalisasi identitas sekolah.")

    p_body("Tujuan Khusus:", indent=False)
    tujuan_khusus = [
        "Merancang arsitektur antarmuka portal publik berbasis React 19 dan Tailwind CSS dengan konsep visual Modern Editorial dan Glassmorphism (frosted glass) yang responsif di berbagai perangkat.",
        "Menggantikan seluruh fungsi JavaScript native alert() dengan sistem umpan balik visual Custom Toast Notification dan Modal Component UI yang elegan.",
        "Membangun showcase komprehensif untuk 5 program keahlian vokasi (Pertanian, Peternakan, Akuntansi & Bisnis Digital, DKV, dan TBSM).",
        "Mengembangkan modul CMS untuk pengelolaan warta berita dengan alur kerja (draft, review, published, archived), kalender agenda, pengumuman kedinasan, riwayat prestasi, dan direktori sarana prasarana.",
        "Mengembangkan Media Library dengan fitur kompresi citra otomatis WebP dan pembuangan metadata EXIF berbasis mesin Sharp.",
        "Menerapkan Role-Based Access Control (RBAC) berjenjang dengan pembagian peran Super Admin, Humas/Admin, dan Staf, disertai invarian proteksi akun Super Admin terakhir.",
        "Membangun basis data relasional 16 entitas menggunakan Prisma ORM dan MySQL 8 yang terindeks secara efisien.",
        "Menerapkan mekanisme keamanan defense in depth (Argon2id, JWT HttpOnly Cookie, sanitasi HTML, dan rate limiting).",
        "Melakukan pengujian menyeluruh terhadap fungsionalitas sistem melalui Black Box Testing dan pengujian kepuasan pengguna melalui System Usability Scale (SUS)."
    ]
    for idx, t in enumerate(tujuan_khusus, 1):
        p_item = doc.add_paragraph()
        p_item.paragraph_format.line_spacing = 1.5
        p_item.paragraph_format.left_indent = Cm(1.27)
        p_item.paragraph_format.first_line_indent = Cm(-0.6)
        p_item.paragraph_format.space_after = Pt(2)
        r = p_item.add_run(f"{idx}. {t}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    p_subbab("1.4 Kerangka Pemikiran")
    p_body("Kerangka pemikiran rekayasa sistem ini mengaitkan komponen masukan (input) berupa kebutuhan digitalisasi dan permasalahan operasional di sekolah, komponen proses (process) berupa metodologi Waterfall dan penerapan tumpukan teknologi modern, komponen keluaran (output) berupa website profil dan CMS terintegrasi, serta komponen hasil (outcome) berupa efisiensi tata kelola informasi sekolah.")

    p_caption_gambar("1", "Kerangka Pemikiran Pengembangan Sistem SMKN 1 Pakuan Ratu")
    # A formatted box / table for Kerangka Pemikiran
    tbl_kp = doc.add_table(rows=4, cols=1)
    apply_open_table_style(tbl_kp, [Cm(14.0)])
    
    kp_boxes = [
        ("INPUT (Kondisi Masalah & Kebutuhan):", "• Ketergantungan pembaruan konten pada programmer eksternal.\n• Citra foto praktikum berukuran besar tanpa kompresi dan membawa metadata EXIF GPS.\n• Antarmuka kaku, minim responsivitas mobile, dan penggunaan alert() native browser.\n• Ancaman siber seperti brute-force, SQL injection, XSS, dan kebocoran data."),
        ("PROSES (Metodologi & Rekayasa Sistem):", "• Model Waterfall: Analisis, Desain Arsitektur, Implementasi Kode, Pengujian, Penerapan.\n• Frontend: React 19, Vite 6, TypeScript, Tailwind CSS 3 (Glassmorphism), Zustand, TanStack Query.\n• Backend: Node.js, Express, TypeScript, Prisma ORM, MySQL 8, Sharp Processing Pipeline.\n• Keamanan: Enkripsi Argon2id, JWT HttpOnly Cookie, Sanitasi HTML, Rate Limiting.\n• Pengujian: Vitest Unit Test, Black Box Testing, System Usability Scale (SUS)."),
        ("OUTPUT (Produk Rekayasa Perangkat Lunak):", "• Website profil resmi interaktif dengan etalase 5 program keahlian vokasi.\n• Panel CMS mandiri dengan RBAC 3 tingkat (Super Admin, Humas, Staf) dan Audit Trail.\n• Media Library otomatis terkompresi WebP dan bersih dari metadata privasi EXIF.\n• Komponen antarmuka Custom Toast dan Modal interaktif."),
        ("OUTCOME (Dampak Nyata):", "• Kemandirian staf sekolah dalam publikasi informasi secara cepat dan akurat.\n• Penguatan citra kelembagaan (branding) SMKN 1 Pakuan Ratu di mata DUDI dan publik.\n• Efisiensi bandwidth jaringan sekolah dan kenyamanan akses informasi bagi peserta didik.")
    ]
    for idx, (title, content) in enumerate(kp_boxes):
        cell_p = tbl_kp.rows[idx].cells[0].paragraphs[0]
        cell_p.paragraph_format.line_spacing = 1.15
        cell_p.paragraph_format.space_before = Pt(4)
        cell_p.paragraph_format.space_after = Pt(4)
        r1 = cell_p.add_run(f"{title}\n")
        r1.bold = True
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r2 = cell_p.add_run(content)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(10.5)

    p_subbab("1.5 Batasan Masalah")
    p_body("Untuk memfokuskan ruang lingkup penelitian agar tepat sasaran, ditetapkan batasan masalah sebagai berikut:")
    batasan = [
        "Objek penelitian difokuskan secara khusus pada lingkungan SMK Negeri 1 Pakuan Ratu, Kabupaten Way Kanan, Provinsi Lampung.",
        "Konten profil kejuruan dikhususkan pada 5 program keahlian yang aktif diselenggarakan di sekolah (Pertanian, Peternakan, Akuntansi & Bisnis Digital, DKV, dan TBSM).",
        "Sistem terdiri dari dua modul utama: Portal Profil Publik untuk pengunjung umum dan Panel Kontrol CMS untuk staf administrasi terautentikasi.",
        "Pengelolaan hak akses pengguna dibatasi pada 3 tingkat peran: Super Admin, Admin/Humas, dan Staf.",
        "Format berkas citra yang didukung pada Media Library adalah JPEG, PNG, dan WebP dengan batas ukuran unggahan maksimal 10 MB per berkas.",
        "Pengujian fungsionalitas dilakukan menggunakan Automated Unit Test (Vitest) dan Black Box Testing, sedangkan pengujian kegunaan menggunakan instrumen kuesioner System Usability Scale (SUS) kepada 20 responden."
    ]
    for idx, b in enumerate(batasan, 1):
        p_item = doc.add_paragraph()
        p_item.paragraph_format.line_spacing = 1.5
        p_item.paragraph_format.left_indent = Cm(1.27)
        p_item.paragraph_format.first_line_indent = Cm(-0.6)
        p_item.paragraph_format.space_after = Pt(2)
        r = p_item.add_run(f"{idx}. {b}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    p_subbab("1.6 Kontribusi Penelitian")
    p_body("Penelitian tugas akhir ini diharapkan memberikan kontribusi nyata dalam aspek praktis dan akademis:")
    p_body("1. Kontribusi Praktis:", indent=False)
    p_body("Memberikan platform digital mandiri yang profesional dan siap pakai bagi SMKN 1 Pakuan Ratu untuk meningkatkan efisiensi publikasi warta, transparansi pengumuman, dan promosi prestasi siswa kepada dunia industri serta masyarakat.")
    p_body("2. Kontribusi Akademis:", indent=False)
    p_body("Menjadi referensi ilmiah dan percontohan implementasi rekayasa perangkat lunak modern yang mengombinasikan Clean Architecture, Single Page Application (SPA) React 19, gaya desain Glassmorphism, optimasi citra WebP nir-kehilangan dengan Sharp, serta pertahanan siber berlapis di Politeknik Negeri Lampung.")

    doc.add_page_break()

    # =========================================================================
    # BAB II. TINJAUAN PUSTAKA
    # =========================================================================
    p_heading_bab("II", "TINJAUAN PUSTAKA")

    p_subbab("2.1 Website Profil Sekolah dan Transformasi Digital Vokasi")
    p_body("Website profil institusi adalah kumpulan berkas informasi digital yang disajikan secara terpadu melalui protokol Hypertext Transfer Protocol Secure (HTTPS) dalam satu domain internet resmi. Dalam ranah pendidikan vokasi, website sekolah berfungsi sebagai etalase digital interaktif yang memproyeksikan kualitas pembelajaran, sarana praktikum bengkel, kualifikasi tenaga pendidik, dan jejaring kemitraan industri (Pressman & Maxim, 2020). Desain yang responsif dan informatif memungkinkan calon siswa dan orang tua memperoleh pemahaman komprehensif mengenai prospek kerja masing-masing jurusan.")

    p_subbab("2.2 Content Management System (CMS) dan Alur Kerja Publikasi")
    p_body("Content Management System (CMS) adalah perangkat lunak yang dirancang untuk mempermudah pembuatan, pengorganisasian, penyuntingan, dan penerbitan konten web secara kolaboratif tanpa mengharuskan pengguna memahami bahasa pemrograman (Sommerville, 2016). Pada aplikasi ini, CMS mengimplementasikan alur kerja penerbitan formal (Draft -> Review -> Published -> Archived) yang menjamin seluruh informasi yang tayang ke publik telah melalui tahap kurasi redaksional.")

    p_subbab("2.3 Role-Based Access Control (RBAC) dan Keamanan Aplikasi")
    p_body("Role-Based Access Control (RBAC) adalah metode pengamanan otorisasi yang memetakan izin akses (permissions) ke dalam peran (roles) tertentu (Ferraiolo et al., 2007). Hak akses pengguna dievaluasi pada lapisan middleware sebelum permintaan dapat mengeksekusi fungsi logika bisnis. Matriks hak akses sistem SMKN 1 Pakuan Ratu disajikan pada Tabel 1.")

    p_caption_table("1", "Matriks Hak Akses Pengguna (Role-Based Access Control)")
    tbl_rbac = doc.add_table(rows=14, cols=5)
    apply_open_table_style(tbl_rbac, [Cm(1.0), Cm(4.5), Cm(2.8), Cm(2.8), Cm(2.9)])
    
    rbac_headers = ["No.", "Modul Sistem", "Super Admin", "Admin (Humas)", "Staf Sekolah"]
    for c_i, h_text in enumerate(rbac_headers):
        cell_p = tbl_rbac.rows[0].cells[c_i].paragraphs[0]
        cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = cell_p.add_run(h_text)
        r.bold = True
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)

    rbac_rows = [
        ("1", "Membaca Konten Publik", "Mengizinkan", "Mengizinkan", "Mengizinkan"),
        ("2", "Kirim Pesan Formulir Kontak", "Mengizinkan", "Mengizinkan", "Mengizinkan"),
        ("3", "Kelola Warta Berita & Tag", "Akses Penuh", "Akses Penuh", "Draf Saja"),
        ("4", "Kelola Kalender Agenda", "Akses Penuh", "Akses Penuh", "Akses Baca"),
        ("5", "Kelola Surat Pengumuman", "Akses Penuh", "Akses Penuh", "Akses Baca"),
        ("6", "Kelola Prestasi Siswa", "Akses Penuh", "Akses Penuh", "Akses Baca"),
        ("7", "Kelola Galeri & Media Library", "Akses Penuh", "Akses Penuh", "Draf Saja"),
        ("8", "Kelola Halaman Profil Sekolah", "Akses Penuh", "Akses Penuh", "Tolak Akses"),
        ("9", "Kelola Teks Banner Beranda", "Akses Penuh", "Akses Penuh", "Tolak Akses"),
        ("10", "Membaca Kotak Pesan Aspirasi", "Akses Penuh", "Akses Penuh", "Tolak Akses"),
        ("11", "Manajemen Akun Pengguna", "Akses Penuh", "Tolak Akses", "Tolak Akses"),
        ("12", "Audit Trail Log Sistem", "Akses Penuh", "Tolak Akses", "Tolak Akses"),
        ("13", "Pengaturan Konfigurasi Sekolah", "Akses Penuh", "Tolak Akses", "Tolak Akses")
    ]
    for r_i, row_data in enumerate(rbac_rows, 1):
        for c_i, val in enumerate(row_data):
            cell_p = tbl_rbac.rows[r_i].cells[c_i].paragraphs[0]
            if c_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_i == 1:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_subbab("2.4 Desain Antarmuka Glassmorphism dan Pengalaman Pengguna")
    p_body("Glassmorphism adalah tren estetika antarmuka pengguna yang meniru karakteristik fisik kaca tembus pandang atau kaca buram (frosted glass) (Nielsen, 2020). Desain ini dicapai dengan menggabungkan latar belakang semi-transparan (bg-white/40), filter pemburaman latar belakang (backdrop-blur-md), batas kontur tipis yang halus (border-white/40), serta bayangan bayang-bayang lembut (shadow-sm). Efek ini menghasilkan kedalaman hierarki visual bertingkat yang modern dan elegan.")

    p_body("Untuk meningkatkan pengalaman pengguna, aplikasi ini mengeliminasi dialog popup bawaan peramban seperti JavaScript native alert() yang memblokir antarmuka peramban. Sebagai gantinya, dikembangkan Custom Toast Notification untuk umpan balik instan yang mengambang dan Modal Component UI untuk dialog interaktif terpusat.")

    p_caption_gambar("2", "Diagram Alir Arsitektur Sistem Terintegrasi (High-Level Design)")
    p_body("Diagram arsitektur sistem pada Gambar 2 memperlihatkan interaksi antara lapisan peramban klien (React 19), gerbang reverse proxy Nginx, lapisan middleware Express backend, logika bisnis service layer, pipa Sharp, dan basis data relasional MySQL 8 yang dikelola oleh Prisma ORM.")

    p_subbab("2.5 Tinjauan Teknologi Pengembangan Sistem")
    p_body("2.5.1 React 19 dan TypeScript\nReact adalah pustaka antarmuka pengguna berbasis komponen deklaratif yang memanfaatkan Virtual DOM untuk pembaharuan tampilan yang sangat cepat (Banks & Porcello, 2020). Penggunaan TypeScript memberikan pemeriksaan tipe data secara statis (type-safe) yang mencegah bug tipe data saat kompilasi.")

    p_body("2.5.2 Bundler Vite 6\nVite adalah kakas pembangun (build tool) generasi mutakhir yang menyajikan lingkungan server pengembangan instan berbasis native ES modules dan kompilasi produksi yang teroptimasi secara mendalam (Freeman, 2021).")

    p_body("2.5.3 Tailwind CSS\nTailwind CSS adalah kerangka kerja CSS berbasis kelas utilitas (utility-first) yang memfasilitasi pembuatan tata letak responsif dan desain Glassmorphism langsung pada berkas komponen antarmuka pengguna (Wathan et al., 2020).")

    p_body("2.5.4 Node.js dan Express Framework\nNode.js menyajikan lingkungan eksekusi JavaScript sisi server dengan model asynchronous event-driven I/O (Flanagan, 2020). Express bertindak sebagai fondasi REST API yang efisien, menghubungkan perutean HTTP dengan lapisan service domain.")

    p_body("2.5.5 Prisma ORM dan MySQL 8\nPrisma ORM menghubungkan model TypeScript dengan basis data relasional MySQL 8 secara otomatis dan type-safe. MySQL 8 menyediakan keandalan penyimpanan data transaksional berintegritas tinggi dengan kepatuhan ACID.")

    p_body("2.5.6 Pemrosesan Citra Digital Sharp Engine\nSharp adalah modul pemrosesan citra digital berbasis libvips yang mampu mengubah citra berukuran besar menjadi WebP secara instan dengan efisiensi kompresi 70-80% seraya menghapus metadata EXIF yang berpotensi membocorkan lokasi geografis pengguna (Sharp Documentation, 2024).")

    p_body("2.5.7 Manajemen Status (TanStack Query dan Zustand)\nTanStack React Query menangani sinkronisasi server-state, caching, dan invalidasi kueri otomatis. Zustand menangani client-state ringan seperti status notifikasi Toast dan data sesi login tanpa overhead Redux.")

    p_body("2.5.8 Kriptografi Argon2id dan JSON Web Token\nArgon2id adalah standar algoritma hashing kata sandi pemenang PHC yang tahan terhadap serangan perangkat keras khusus GPU/ASIC (Biryukov et al., 2016). Autentikasi sesi dikelola menggunakan token JWT yang disimpan dalam HttpOnly Secure Cookie.")

    p_subbab("2.6 Metode Pengujian Sistem")
    p_body("2.6.1 Black Box Testing\nBlack Box Testing adalah metode pengujian fungsional yang berfokus pada evaluasi masukan dan luaran sistem tanpa meninjau kode internal (Khan & Khan, 2012). Pengujian ini memvalidasi setiap skenario use case pada modul publik dan CMS.")

    p_body("2.6.2 System Usability Scale (SUS)\nSystem Usability Scale (SUS) adalah instrumen pengujian kebergunaan berisikan 10 pernyataan terstandardisasi dengan skala Likert 1-5 (Brooke, 1996). Skor SUS yang melampaui angka 68 menunjukkan bahwa sistem dapat diterima dengan baik oleh calon pengguna.")

    doc.add_page_break()

    # =========================================================================
    # BAB III. METODE PELAKSANAAN
    # =========================================================================
    p_heading_bab("III", "METODE PELAKSANAAN")

    p_subbab("3.1 Tempat dan Waktu Pelaksanaan")
    p_body("Penelitian ini bertempat di Laboratorium Komputer Jurusan Ekonomi dan Bisnis Politeknik Negeri Lampung untuk rekayasa perangkat lunak dan di kampus SMK Negeri 1 Pakuan Ratu, Kabupaten Way Kanan untuk pengumpulan data dan uji coba lapangan. Kegiatan dilaksanakan selama 6 bulan, terhitung April 2026 hingga September 2026.")

    p_subbab("3.2 Bahan dan Alat")
    p_body("3.2.1 Perangkat Keras (Hardware)\nSpesifikasi perangkat keras yang difungsikan dalam pengembangan dan pengujian dirangkum pada Tabel 2.")

    p_caption_table("2", "Spesifikasi Perangkat Keras Pengembangan dan Server")
    tbl_hw = doc.add_table(rows=7, cols=3)
    apply_open_table_style(tbl_hw, [Cm(1.0), Cm(5.0), Cm(8.0)])
    hw_rows = [
        ("No.", "Komponen Perangkat", "Spesifikasi"),
        ("1", "Laptop Pengembangan", "AMD Ryzen 5 / Intel Core i5, RAM 16 GB, SSD 512 GB"),
        ("2", "Server Produksi (Cloud VPS)", "2 vCPU Compute, 4 GB ECC RAM, 50 GB NVMe Storage"),
        ("3", "Media Penyimpanan Eksternal", "SSD Portabel 1 TB USB 3.2 untuk cadangan kode & basis data"),
        ("4", "Perangkat Klien Uji Coba", "Laptop Windows 11, Smartphone Android, & iPhone iOS"),
        ("5", "Konektivitas Jaringan", "Koneksi internet broadband 50 Mbps"),
        ("6", "Perangkat Cetak", "Printer multifungsi untuk pencetakan instrumen dan laporan")
    ]
    for r_i, row in enumerate(hw_rows):
        for c_i, val in enumerate(row):
            cell_p = tbl_hw.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_body("3.2.2 Perangkat Lunak (Software)\nSpesifikasi perangkat lunak yang digunakan selama rekayasa sistem disajikan pada Tabel 3.")

    p_caption_table("3", "Spesifikasi Perangkat Lunak Sistem")
    tbl_sw = doc.add_table(rows=9, cols=3)
    apply_open_table_style(tbl_sw, [Cm(1.0), Cm(5.0), Cm(8.0)])
    sw_rows = [
        ("No.", "Perangkat Lunak", "Keterangan & Versi"),
        ("1", "Sistem Operasi", "Windows 11 Pro 64-bit & Ubuntu Server 24.04 LTS"),
        ("2", "Editor Kode Sumber", "Visual Studio Code dengan ekstensi TypeScript & Tailwind"),
        ("3", "Lingkungan Eksekusi", "Node.js v20+ / v25+ Long Term Support"),
        ("4", "Sistem Basis Data", "MySQL Server versi 8.0 & Prisma ORM versi 6"),
        ("5", "Peramban Web Uji", "Google Chrome, Mozilla Firefox, Microsoft Edge"),
        ("6", "Pengujian API", "Postman & Thunder Client"),
        ("7", "Pengontrol Versi", "Git & Repositori GitHub"),
        ("8", "Desain Antarmuka", "Figma Design Tool")
    ]
    for r_i, row in enumerate(sw_rows):
        for c_i, val in enumerate(row):
            cell_p = tbl_sw.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_subbab("3.3 Rancangan Penelitian dan Model Pengembangan Sistem")
    p_body("Penelitian ini menerapkan model rekayasa perangkat lunak Waterfall (Pressman & Maxim, 2020) yang berjalan secara terstruktur dan berurutan melalui lima fase:")

    p_body("3.3.1 Tahap Analisis Kebutuhan (Requirements Analysis)\nMelakukan wawancara mendalam dan penelusuran dokumen kurikulum di SMKN 1 Pakuan Ratu untuk memetakan kebutuhan fungsional portal publik dan CMS pengelola.")

    p_body("3.3.2 Tahap Perancangan Sistem dan Basis Data (System Design)\nMenyusun diagram alur data, Use Case Diagram, pemodelan 16 entitas relasional basis data pada skema Prisma, serta pembuatan wireframe antarmuka dengan aksen Glassmorphism.")

    p_body("3.3.3 Tahap Implementasi Kode Program (Implementation)\nMelakukan pengkodean backend Express berorientasi layanan, integrasi middleware keamanan, kompresi gambar otomatis Sharp, serta penyusunan komponen frontend React 19 yang terbebas dari JavaScript alert native.")

    p_body("3.3.4 Tahap Pengujian Sistem (Verification / Testing)\nMelakukan Automated Unit Testing dengan Vitest, Black Box Testing fungsionalitas, uji kerentanan keamanan siber, dan uji kepuasan pengguna menggunakan kuesioner SUS.")

    p_body("3.3.5 Tahap Penerapan dan Pemeliharaan (Deployment & Maintenance)\nMenyebarkan sistem ke peladen Cloud VPS dengan reverse proxy Nginx dan sertifikat SSL Let's Encrypt, serta melakukan pelatihan kepada operator sekolah.")

    p_caption_gambar("3", "Diagram Alur Pengembangan Sistem Waterfall Model")
    p_caption_gambar("4", "Diagram Use Case Modul Publik dan CMS Pengelola")

    p_subbab("3.4 Prosedur Pelaksanaan Proyek")
    p_body("Prosedur kerja penelitian dibagi menjadi lima langkah operasional terstruktur:")
    prosedur = [
        "Langkah 1 (Studi Pendahuluan): Wawancara dengan kepala sekolah, staf kehumasan, dan ketua program keahlian untuk menghimpun data profil, visi-misi, serta foto sarana prasarana sekolah.",
        "Langkah 2 (Pemodelan Sistem): Perancangan skema relasional 16 tabel basis data, spesifikasi kontrak REST API JSON, serta wireframing UI dengan konsep Modern Editorial.",
        "Langkah 3 (Pengembangan Perangkat Lunak): Konstruksi kode frontend dan backend, integrasi Prisma ORM dengan MySQL 8, serta pengikatan pustaka Sharp untuk pipa konversi citra WebP otomatis.",
        "Langkah 4 (Pengujian Kualitas & Keamanan): Menjalankan uji unit test Vitest, verifikasi matriks kasus uji Black Box, uji ketahanan terhadap serangan XSS dan brute-force, serta survei usability kuesioner SUS kepada 20 responden.",
        "Langkah 5 (Penerapan & Pelaporan): Konfigurasi server produksi VPS, pelatihan staf admin sekolah, dan penyusunan naskah karya ilmiah sesuai format Polinela."
    ]
    for p_item in prosedur:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.5
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-0.6)
        p_row.paragraph_format.space_after = Pt(3)
        r = p_row.add_run(p_item)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    p_subbab("3.5 Parameter Pengamatan dan Pengujian")
    p_body("3.5.1 Pengujian Fungsionalitas (Black Box Testing)\nEvaluasi fungsionalitas sistem dilaksanakan untuk memastikan seluruh fungsi masukan dan keluaran sistem berjalan sesuai spesifikasi kebutuhan tanpa kesalahan fatal, sebagaimana disajikan pada Tabel 4.")

    p_caption_table("4", "Rencana Kasus Uji Pengujian Fungsional (Black Box Testing)")
    tbl_bb = doc.add_table(rows=11, cols=4)
    apply_open_table_style(tbl_bb, [Cm(1.0), Cm(3.2), Cm(6.8), Cm(3.0)])
    bb_data = [
        ("No.", "Modul Uji", "Skenario Pengujian Masukan", "Hasil Diharapkan"),
        ("1", "Autentikasi", "Input email dan sandi yang terdaftar", "Login berhasil, sesi HttpOnly cookie terbuat"),
        ("2", "Rate Limiter", "Input sandi salah 5 kali berturut-turut", "Akses login diblokir sementara dengan pesan aman"),
        ("3", "Draf Berita", "Menyimpan artikel status DRAFT", "Artikel tersimpan di CMS dan tidak tampil di publik"),
        ("4", "Terbit Berita", "Mengubah status artikel ke PUBLISHED", "Artikel tayang seketika di halaman warta publik"),
        ("5", "Media Library", "Unggah gambar resolusi tinggi (8 MB)", "Citra dikonversi ke WebP (<500 KB) tanpa data EXIF"),
        ("6", "Dialog Modal", "Aksi penghapusan data artikel warta", "Muncul Modal Konfirmasi estetik (bukan alert)"),
        ("7", "Toast Feedback", "Penyimpanan data berhasil dilakukan", "Tampil notifikasi Toast mengambang otomatis"),
        ("8", "Proteksi RBAC", "Akun Staf mencoba mengakses menu pengguna", "Akses ditolak sistem dengan respon 403 Forbidden"),
        ("9", "Invarian Admin", "Super Admin menghapus satu-satunya akun utama", "Ditolak sistem untuk mencegah lock-out permanen"),
        ("10", "Responsif UI", "Mengakses portal lewat ponsel lebar 375px", "Navigasi responsif dan tata letak tidak rusak")
    ]
    for r_i, row in enumerate(bb_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_bb.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_body("3.5.2 Pengujian Keamanan Siber (Security Assessment)\nMemvalidasi ketahanan aplikasi terhadap kerentanan OWASP Top 10 sebagaimana dirangkum pada Tabel 5.")

    p_caption_table("5", "Matriks Parameter Evaluasi Keamanan Web (Security Checklist)")
    tbl_sec = doc.add_table(rows=7, cols=3)
    apply_open_table_style(tbl_sec, [Cm(1.0), Cm(4.0), Cm(9.0)])
    sec_data = [
        ("No.", "Parameter Keamanan", "Mekanisme Perlindungan yang Diuji"),
        ("1", "Injeksi SQL", "Kueri diparameterisasi secara ketat menggunakan Prisma ORM"),
        ("2", "Cross-Site Scripting (XSS)", "Sanitasi seluruh masukan HTML menggunakan pustaka sanitize-html"),
        ("3", "Brute-Force Attack", "Penerapan express-rate-limit pada rute login dan kontak formulir"),
        ("4", "Pencurian Sesi Cookie", "Penggunaan flag HttpOnly, SameSite=Strict, dan Secure pada token JWT"),
        ("5", "Enkripsi Kredensial", "Penerapan algoritma hashing Argon2id bergaram kriptografis"),
        ("6", "Unggahan Berbahaya", "Pembersihan metadata EXIF dan konversi mutlak ke format WebP via Sharp")
    ]
    for r_i, row in enumerate(sec_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_sec.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_subbab("3.6 Jadwal Pelaksanaan Penelitian")
    p_body("Rencana jadwal pelaksanaan proyek selama kurun waktu enam bulan disajikan dalam bentuk Gantt Chart pada Tabel 6.")

    p_caption_table("6", "Jadwal Rencana Pelaksanaan Proyek (Gantt Chart 6 Bulan)")
    tbl_jd = doc.add_table(rows=10, cols=8)
    apply_open_table_style(tbl_jd, [Cm(1.0), Cm(7.0), Cm(1.0), Cm(1.0), Cm(1.0), Cm(1.0), Cm(1.0), Cm(1.0)])
    jd_rows = [
        ("No.", "Uraian Kegiatan Proyek", "B1", "B2", "B3", "B4", "B5", "B6"),
        ("1", "Studi Pustaka & Observasi SMKN 1 Pakuan Ratu", "[X]", "", "", "", "", ""),
        ("2", "Analisis Kebutuhan Sistem & Wawancara Pimpinan", "[X]", "[X]", "", "", "", ""),
        ("3", "Desain Arsitektur Sistem, Basis Data, & Wireframe", "", "[X]", "[X]", "", "", ""),
        ("4", "Konstruksi Basis Data & Backend Express Service", "", "", "[X]", "[X]", "", ""),
        ("5", "Konstruksi Frontend React 19 & Glassmorphic UI", "", "", "", "[X]", "[X]", ""),
        ("6", "Integrasi Pipeline Sharp & Sistem Keamanan Web", "", "", "", "", "[X]", ""),
        ("7", "Pengujian Fungsionalitas, Keamanan, & Kuesioner SUS", "", "", "", "", "[X]", "[X]"),
        ("8", "Penerapan pada Peladen Produksi VPS (Deployment)", "", "", "", "", "", "[X]"),
        ("9", "Penyusunan Naskah Karya Ilmiah & Ujian Tugas Akhir", "", "", "", "", "[X]", "[X]")
    ]
    for r_i, row in enumerate(jd_rows):
        for c_i, val in enumerate(row):
            cell_p = tbl_jd.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    p_subbab("3.7 Personalia Pelaksana Proyek")
    p_body("Susunan tim personalia pelaksana proyek tugas akhir ini tercantum pada Tabel 7.")

    p_caption_table("7", "Susunan Personalia Tim Pelaksana Proyek")
    tbl_per = doc.add_table(rows=4, cols=4)
    apply_open_table_style(tbl_per, [Cm(1.0), Cm(4.5), Cm(3.5), Cm(5.0)])
    per_rows = [
        ("No.", "Nama & Identitas", "Jabatan / Kedudukan", "Alokasi Waktu & Tugas"),
        ("1", "[Dosen Pembimbing I, Gelar]\nNIP. [NIP Dosen I]", "Dosen Pembimbing I", "6 jam/minggu; Pembimbing metodologi dan substansi rekayasa perangkat lunak"),
        ("2", "[Dosen Pembimbing II, Gelar]\nNIP. [NIP Dosen II]", "Dosen Pembimbing II", "6 jam/minggu; Pembimbing teknis pengkodean, keamanan, dan tata tulis"),
        ("3", "[NAMA MAHASISWA]\nNPM. [NPM MAHASISWA]", "Mahasiswa Pelaksana", "30 jam/minggu; Perancangan, pengkodean, pengujian, penerapan, dan dokumentasi")
    ]
    for r_i, row in enumerate(per_rows):
        for c_i, val in enumerate(row):
            cell_p = tbl_per.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    doc.add_page_break()

    # =========================================================================
    # BAB IV. RENCANA ANGGARAN BIAYA PENELITIAN
    # =========================================================================
    p_heading_bab("IV", "RENCANA ANGGARAN BIAYA PENELITIAN")

    p_subbab("4.1 Rekapitulasi Rencana Anggaran Biaya")
    p_body("Rekapitulasi alokasi pembiayaan yang diusulkan untuk mendukung penyelesaian penelitian tugas akhir ini disajikan pada Tabel 8.")

    p_caption_table("8", "Rekapitulasi Rencana Anggaran Biaya Proyek")
    tbl_rab = doc.add_table(rows=6, cols=4)
    apply_open_table_style(tbl_rab, [Cm(1.0), Cm(7.0), Cm(3.5), Cm(2.5)])
    rab_data = [
        ("No.", "Uraian Komponen Pengeluaran", "Alokasi Biaya (Rp)", "Persentase (%)"),
        ("1", "Pengadaan Bahan, Perangkat Keras, & Lisensi", "3.250.000,00", "34,76"),
        ("2", "Operasional Riset Lapangan & Pengumpulan Data", "2.100.000,00", "22,46"),
        ("3", "Domain Sekolah, Cloud VPS Server, & Keamanan", "1.850.000,00", "19,79"),
        ("4", "Seminar, Pengujian Akseptansi SUS, & Pelaporan", "2.150.000,00", "22,99"),
        ("Total", "Jumlah Keseluruhan Anggaran yang Diusulkan", "9.350.000,00", "100,00")
    ]
    for r_i, row in enumerate(rab_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_rab.rows[r_i].cells[c_i].paragraphs[0]
            if r_i == 0 or r_i == 5:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 1 else WD_ALIGN_PARAGRAPH.RIGHT)
                r = cell_p.add_run(val)
                r.bold = True
            else:
                cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i == 0 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 1 else WD_ALIGN_PARAGRAPH.RIGHT)
                r = cell_p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)

    p_subbab("4.2 Rincian Alokasi Biaya")
    p_body("Rincian alokasi anggaran pada masing-masing komponen biaya dijabarkan secara rinci pada Tabel 9 sampai dengan Tabel 12.")

    p_caption_table("9", "Rincian Anggaran Pembelian Perangkat Keras dan Lisensi")
    tbl_t9 = doc.add_table(rows=7, cols=6)
    apply_open_table_style(tbl_t9, [Cm(0.8), Cm(5.2), Cm(1.5), Cm(1.5), Cm(2.5), Cm(2.5)])
    t9_data = [
        ("No.", "Uraian Kebutuhan", "Vol.", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"),
        ("1", "SSD Portabel 1 TB Cadangan Data", "1", "Unit", "1.450.000,00", "1.450.000,00"),
        ("2", "Flashdisk USB 3.2 64 GB Distribusi", "2", "Unit", "175.000,00", "350.000,00"),
        ("3", "Tinta Printer Refill Hitam & Warna", "4", "Botol", "125.000,00", "500.000,00"),
        ("4", "Kertas HVS A4 80 gram", "5", "Rim", "65.000,00", "325.000,00"),
        ("5", "Lisensi Aset Grafis & Ikon Desain", "1", "Paket", "625.000,00", "625.000,00"),
        ("Subtotal", "Subtotal Komponen Pengadaan Alat & Lisensi", "", "", "", "3.250.000,00")
    ]
    for r_i, row in enumerate(t9_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_t9.rows[r_i].cells[c_i].paragraphs[0]
            is_bold = (r_i == 0 or r_i == 6)
            cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 2, 3] else (WD_ALIGN_PARAGRAPH.RIGHT if c_i in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
            r = cell_p.add_run(val)
            r.bold = is_bold
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    p_caption_table("10", "Rincian Anggaran Operasional Riset dan Pengumpulan Data")
    tbl_t10 = doc.add_table(rows=5, cols=6)
    apply_open_table_style(tbl_t10, [Cm(0.8), Cm(5.2), Cm(1.5), Cm(1.5), Cm(2.5), Cm(2.5)])
    t10_data = [
        ("No.", "Uraian Kebutuhan", "Vol.", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"),
        ("1", "Transport Lapangan (B.Lampung - Pakuan Ratu)", "3", "Kali", "450.000,00", "1.350.000,00"),
        ("2", "Konsumsi Tim Lapangan saat Observasi", "3", "Hari", "150.000,00", "450.000,00"),
        ("3", "Paket Kuota Internet Pengujian Lapangan", "3", "Bulan", "100.000,00", "300.000,00"),
        ("Subtotal", "Subtotal Komponen Operasional Riset Lapangan", "", "", "", "2.100.000,00")
    ]
    for r_i, row in enumerate(t10_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_t10.rows[r_i].cells[c_i].paragraphs[0]
            is_bold = (r_i == 0 or r_i == 4)
            cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 2, 3] else (WD_ALIGN_PARAGRAPH.RIGHT if c_i in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
            r = cell_p.add_run(val)
            r.bold = is_bold
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    p_caption_table("11", "Rincian Anggaran Domain, Hosting VPS, dan Keamanan Cloud")
    tbl_t11 = doc.add_table(rows=5, cols=6)
    apply_open_table_style(tbl_t11, [Cm(0.8), Cm(5.2), Cm(1.5), Cm(1.5), Cm(2.5), Cm(2.5)])
    t11_data = [
        ("No.", "Uraian Kebutuhan", "Vol.", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"),
        ("1", "Sewa Cloud VPS Server Produksi Linux", "12", "Bulan", "115.000,00", "1.380.000,00"),
        ("2", "Pendaftaran Domain Sekolah (sch.id)", "1", "Tahun", "170.000,00", "170.000,00"),
        ("3", "Layanan Keamanan DNS & WAF Cloud", "1", "Paket", "300.000,00", "300.000,00"),
        ("Subtotal", "Subtotal Komponen Domain & Infrastruktur Cloud", "", "", "", "1.850.000,00")
    ]
    for r_i, row in enumerate(t11_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_t11.rows[r_i].cells[c_i].paragraphs[0]
            is_bold = (r_i == 0 or r_i == 4)
            cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 2, 3] else (WD_ALIGN_PARAGRAPH.RIGHT if c_i in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
            r = cell_p.add_run(val)
            r.bold = is_bold
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    p_caption_table("12", "Rincian Anggaran Seminar, Uji Publik, dan Pelaporan")
    tbl_t12 = doc.add_table(rows=7, cols=6)
    apply_open_table_style(tbl_t12, [Cm(0.8), Cm(5.2), Cm(1.5), Cm(1.5), Cm(2.5), Cm(2.5)])
    t12_data = [
        ("No.", "Uraian Kebutuhan", "Vol.", "Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"),
        ("1", "Penggandaan Draf Proposal Tugas Akhir", "5", "Eks.", "60.000,00", "300.000,00"),
        ("2", "Pelaksanaan Seminar Proposal", "1", "Kegiatan", "450.000,00", "450.000,00"),
        ("3", "Insentif & Konsumsi Responden SUS (20 org)", "20", "Paket", "35.000,00", "700.000,00"),
        ("4", "Penjilidan Hard Cover Laporan Akhir", "5", "Eks.", "90.000,00", "450.000,00"),
        ("5", "Publikasi Artikel Ilmiah Terakreditasi", "1", "Artikel", "250.000,00", "250.000,00"),
        ("Subtotal", "Subtotal Komponen Seminar, Uji, & Pelaporan", "", "", "", "2.150.000,00")
    ]
    for r_i, row in enumerate(t12_data):
        for c_i, val in enumerate(row):
            cell_p = tbl_t12.rows[r_i].cells[c_i].paragraphs[0]
            is_bold = (r_i == 0 or r_i == 6)
            cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 2, 3] else (WD_ALIGN_PARAGRAPH.RIGHT if c_i in [4, 5] else WD_ALIGN_PARAGRAPH.LEFT)
            r = cell_p.add_run(val)
            r.bold = is_bold
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    doc.add_page_break()

    # =========================================================================
    # DAFTAR PUSTAKA
    # =========================================================================
    p_dp = doc.add_paragraph()
    p_dp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dp.paragraph_format.space_before = Pt(0)
    p_dp.paragraph_format.space_after = Pt(18)
    run = p_dp.add_run("DAFTAR PUSTAKA")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    pustaka_entries = [
        "Banks, A. and Porcello, E. 2020. Learning React: Modern Patterns for Developing React Applications. O'Reilly Media. Sebastopol, USA. 350 hal.",
        "Biryukov, A., Dinu, D., and Khovratovich, D. 2016. Argon2: new generation of memory-hard functions for password hashing and other applications. IEEE European Symposium on Security and Privacy. Vol. 1: 292-302.",
        "Boote, K.J., Bennett, J.M., Sinclair, T.R., and Paulsen, G.M. 1994. Physiology and Determination of Crop Yield. ASA-CSSA-SSSA. Madison, USA. 601 hal.",
        "Brooke, J. 1996. SUS: A 'quick and dirty' usability scale. In Jordan, P.W., Thomas, B., Weerdmeester, B.A., and McClelland, I.L. (Eds.). Usability Evaluation in Industry. Taylor & Francis. London, UK. Halaman 189-194.",
        "Ferraiolo, D.F., Kuhn, D.R., and Chandramouli, R. 2007. Role-Based Access Control. Second Edition. Artech House. Boston, USA. 405 hal.",
        "Flanagan, D. 2020. JavaScript: The Definitive Guide: Master the World's Most-Used Programming Language. Seventh Edition. O'Reilly Media. Sebastopol, USA. 704 hal.",
        "Freeman, A. 2021. Pro React 18: Build Modern Web Applications with React using TypeScript. Apress. New York, USA. 680 hal.",
        "Hidayat, B., Muslihudin, M., dan Akmal, S. 2018. Perubahan karakteristik fisikokimia tepung onggok selama proses fermentasi padat menggunakan Saccharomyces cerevisiae. Jurnal Penelitian Pertanian Terapan. 18 (3): 146-152.",
        "Khan, M.E. and Khan, F. 2012. A comparative study of white box, black box and grey box testing techniques. International Journal of Advanced Computer Science and Applications. 3 (6): 12-15.",
        "Kurniawan, D. dan Syahputra, R. 2021. Rancang bangun sistem informasi profil sekolah kejuruan berbasis web responsif untuk optimalisasi publikasi institusi. Jurnal Teknologi Informasi dan Rekayasa Komputer. 8 (2): 89-98.",
        "Nielsen, J. 2020. Usability Engineering. Morgan Kaufmann. San Francisco, USA. 362 hal.",
        "OWASP Foundation. 2021. OWASP Top 10: 2021 The Ten Most Critical Web Application Security Risks. Open Web Application Security Project. Maryland, USA. 48 hal.",
        "Politeknik Negeri Lampung. 2018. Pedoman Penulisan Karya Ilmiah Politeknik Negeri Lampung. Polinela Press. Bandar Lampung. 57 hal.",
        "Pressman, R.S. and Maxim, B.R. 2020. Software Engineering: A Practitioner's Approach. Ninth Edition. McGraw-Hill Education. New York, USA. 960 hal.",
        "Prisma Data Inc. 2024. Prisma Documentation: Modern Database Access for TypeScript & Node.js. http://www.prisma.io/docs/diakses tanggal 20 April 2026.",
        "Sharp Documentation. 2024. High Performance Node.js Image Processing. http://sharp.pixelplumbing.com/diakses tanggal 22 April 2026.",
        "Sommerville, I. 2016. Software Engineering. Tenth Edition. Pearson Education. Boston, USA. 810 hal.",
        "Wathan, A., Schoger, S., and Reinink, J. 2020. Refactoring UI. Adam Wathan & Steve Schoger. Toronto, Canada. 250 hal."
    ]

    for p_item in pustaka_entries:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.0
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-1.27)
        p_row.paragraph_format.space_after = Pt(6)
        r = p_row.add_run(p_item)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # LAMPIRAN
    # =========================================================================
    p_lp = doc.add_paragraph()
    p_lp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lp.paragraph_format.space_before = Pt(0)
    p_lp.paragraph_format.space_after = Pt(18)
    run = p_lp.add_run("LAMPIRAN")
    run.bold = True
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)

    p_subbab("Lampiran 1. Entity-Relationship Diagram (ERD) dan Skema Basis Data")
    p_body("Sistem basis data SMKN 1 Pakuan Ratu mengimplementasikan 16 model entitas relasional pada basis data MySQL 8 yang dimediasi oleh Prisma ORM:", indent=False)
    erd_list = [
        "roles & permissions: Mengatur definisi peran (Super Admin, Humas, Staf) dan pemetaan hak akses sistem.",
        "users & sessions: Mengelola kredensial pengelola, hash sandi Argon2id, status aktifasi, dan token sesi peramban.",
        "audit_logs: Merekam setiap aktivitas mutasi data sistem beserta informasi alamat IP dan user-agent.",
        "news, news_categories, & news_tags: Mengelola artikel warta kegiatan, taksonomi kategori, dan label pencarian.",
        "programs & teachers: Menyimpan detail kurikulum 5 jurusan vokasi serta direktori profil pendidik dan tenaga kependidikan.",
        "facilities & achievements: Mendata sarana prasarana praktikum dan rekam jejak kejuaraan siswa.",
        "galleries, gallery_items, & media: Mengorganisir album dokumentasi foto dan berkas citra teroptimasi WebP.",
        "pages, homepage_sections, & settings: Menyimpan konten profil sekolah statis, banner beranda, dan konfigurasi kontak."
    ]
    for e in erd_list:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-0.6)
        p_row.paragraph_format.space_after = Pt(2)
        r = p_row.add_run(f"• {e}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    p_subbab("Lampiran 2. Spesifikasi Endpoint REST API Sistem")
    p_body("Backend Express mengekspos endpoint terstruktur dalam tiga kelompok rute utama:", indent=False)
    api_list = [
        "Kelompok Rute Autentikasi (/api/auth): POST /login (autentikasi dan penerbitan HttpOnly cookie), POST /logout (penghapusan sesi & audit log), GET /me (profil pengguna aktif), PUT /password (pembaruan kata sandi).",
        "Kelompok Rute Publik (/api/public): GET /home (data agregat beranda), GET /profile/:slug (halaman profil), GET /programs (5 jurusan), GET /news (daftar warta), GET /events (agenda mendatang), GET /announcements (pengumuman edaran), GET /achievements (prestasi siswa), POST /contact (pengiriman aspirasi masyarakat).",
        "Kelompok Rute CMS Pengelola (/api/admin): GET /dashboard/stats (ringkasan KPI), POST /media/upload (unggah & kompresi WebP Sharp), operasi CRUD lengkap untuk warta berita, agenda, pengumuman, prestasi, galeri, fasilitas, guru, pengguna (RBAC), serta peninjauan jejak audit (/audit-logs)."
    ]
    for a in api_list:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-0.6)
        p_row.paragraph_format.space_after = Pt(2)
        r = p_row.add_run(f"• {a}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    p_subbab("Lampiran 3. Rancangan Antarmuka Pengguna (UI Wireframe)")
    p_body("Perancangan antarmuka memadukan tata letak Modern Editorial dengan nuansa alam vokasi:", indent=False)
    ui_desc = [
        "Portal Publik: Hero banner bertajuk \"Berakar pada potensi, tumbuh menuju masa depan\", kartu interaktif 5 program keahlian vokasi dengan aksen Glassmorphism (bg-white/40 backdrop-blur-md border-white/40 shadow-sm), jalur bercerita pengalaman siswa, warta terpopuler, kalender agenda, dan formulir kontak terlindungi rate-limit.",
        "Panel CMS Admin: Sidebar navigasi hierarkis, kartu KPI statistik ringkasan, tabel data responsif dengan paginasi, editor berita WYSIWYG bersanitasi HTML, pustaka media interaktif, modal dialog konfirmasi, serta Custom Toast Notification pengganti alert native."
    ]
    for u in ui_desc:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-0.6)
        p_row.paragraph_format.space_after = Pt(2)
        r = p_row.add_run(f"• {u}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    p_subbab("Lampiran 4. Matriks Peran dan Hak Akses (RBAC Matrix)")
    p_body("Hak akses dalam CMS SMKN 1 Pakuan Ratu ditegakkan melalui middleware rbac.ts dengan rincian kewenangan:", indent=False)
    rbac_desc = [
        "Super Admin: Memiliki kendali menyeluruh terhadap sistem, termasuk manajemen akun pengguna, penetapan peran, peninjauan catatan audit log, dan pengaturan konfigurasi umum sekolah. Akun Super Admin terakhir dilindungi oleh sistem dari upaya penghapusan.",
        "Admin (Humas): Memiliki wewenang menerbitkan, mengedit, dan menghapus artikel warta berita, agenda kalender pendidikan, pengumuman kedinasan, riwayat kejuaraan siswa, album foto galeri, serta membaca pesan aspirasi yang masuk.",
        "Staf Sekolah: Memiliki kewenangan terbatas untuk menyusun draf artikel berita dan mengunggah berkas foto ke dalam pustaka media untuk ditinjau lebih lanjut oleh Humas."
    ]
    for r_item in rbac_desc:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.left_indent = Cm(1.27)
        p_row.paragraph_format.first_line_indent = Cm(-0.6)
        p_row.paragraph_format.space_after = Pt(2)
        r = p_row.add_run(f"• {r_item}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    # Save document
    doc.save(output_path)
    print(f"Proposal DOCX successfully created at: {output_path}")

if __name__ == "__main__":
    create_proposal_docx()
