import cups

def set_printer_paper_size(printer_name, width_mm, height_mm):
    # Convert size from mm to inches (CUPS uses inches)
    width_inch = width_mm / 25.4
    height_inch = height_mm / 25.4

    conn = cups.Connection()
    printers = conn.getPrinters()

    if printer_name not in printers:
        print(f"Printer {printer_name} not found")
        return

    # Define options for 4x6 paper size
    options = {
        'media': f'Custom.{width_mm}x{height_mm}mm',
        'PageSize': f'Custom.{width_inch:.2f}x{height_inch:.2f}in'
    }

    # Set the options for the printer
    conn.setPrinterOptions(printer_name, options)

# Specify the printer name and paper size in mm (4 x 6 inches)
printer_name = "Gprinter GP-1324D"  # Replace with your printer name
width_mm = 101.6  # 4 inches in mm
height_mm = 152.4  # 6 inches in mm

set_printer_paper_size(printer_name, width_mm, height_mm)
