import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { promises as fsPromises } from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AssistanceExam } from 'src/assistance-exam/entities/assistance-exam.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(AssistanceExam)
    private assistanceExamRepository: Repository<AssistanceExam>,
  ) {}

  async generateCertificateExam(studentId: number, examId: number) {
    try {
      // 1. Obtener los datos del estudiante desde la base de datos
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
  
      if (!student) {
        return new HttpException(
          'Student does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
  
      const assistanceExam = await this.assistanceExamRepository.findOne({
        where: {
          present: true,
          student: { id: studentId },
          exam: { id: examId },
        },
        relations: ['exam', 'exam.subject'],
      });
      if (!assistanceExam) {
        return new HttpException(
          'No exam or exam assistance was found.',
          HttpStatus.CONFLICT,
        );
      }
  
      // 2. Cargar la plantilla PDF
      const templatePath =
        'C:/Users/admin/Desktop/edu-cert-repo-backEnd/src/templates/template.pdf'; // Ruta a tu plantilla PDF
      const existingPdfBytes = await fsPromises.readFile(templatePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // 3. Modificar el PDF agregando texto adicional
      const page = pdfDoc.getPages()[0]; // Obtener la primera página del documento
  
      // Establecer una fuente estándar y una en negrita
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Fuente en negrita
  
      // Función para formatear el DNI con puntos
      function formatDNI(dni: string): string {
        // Asumiendo que dni es un string con 8 dígitos
        return dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      }
  
      // Obtener la fecha actual en formato dd/mm/yyyy
      const today = new Date();
      const formattedDate = `${assistanceExam.exam.date.getDate()}/${assistanceExam.exam.date.getMonth() + 1}/${assistanceExam.exam.date.getFullYear()}`;
      const formattedDNI = formatDNI(student.identificationNumber);
  
      // Función para obtener el nombre del mes a partir del número de mes
      function getMonthName(monthNumber: number): string {
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthNumber - 1];
      }
  
      // Función para dividir texto largo en líneas
      function splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
  
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      }
  
      // Dividir el texto en partes con formato
      const formattedTextParts = [
        { text: `Por la presente, se deja constancia que`, bold: false},
        { text: `${student.lastName.toLocaleUpperCase()} ${student.firstName.toLocaleUpperCase()} D.N.I ${formattedDNI}`, bold: true },
        { text: `Ha asistido el ${formattedDate} a la mesa examinadora`, bold: false },
        { text: `${assistanceExam.exam.subject.name}`, bold: true },
        { text: `A pedido del interesado/a y para presentar ante quien corresponda,`, bold: false },
        { text: `se extiende la presente en la ciudad de Benito Juárez a los ${today.getDate()} días del mes de ${getMonthName(today.getMonth() + 1)} de ${today.getFullYear()}.`, bold: false }
      ];
  
      // Dividir cada parte en líneas
      const maxWidth = 500; // Ajusta el valor según el ancho máximo permitido
      const fontSize = 11;
      const lines = formattedTextParts.flatMap(part => splitTextIntoLines(part.text, maxWidth, part.bold ? boldFont : font, fontSize).map(line => ({ text: line, bold: part.bold })));
  
      // Calcular posición inicial para el texto en la parte superior de la página
      const { width, height } = page.getSize();
      const startY = height - 180; // Posición vertical desde la parte superior
  
      lines.forEach((line, index) => {
        const yPosition = startY - index * 19; // Espacio entre líneas es 19 (tamaño de fuente + espacio)
        const textSize = (line.bold ? boldFont : font).widthOfTextAtSize(line.text.trim(), fontSize); // Ajusta el tamaño de la fuente aquí si es necesario
        const textX = (width - textSize) / 2; // Posición horizontal para centrar el texto
  
        page.drawText(line.text.trim(), {
          x: textX, // Posición horizontal para centrar el texto
          y: yPosition, // Posición vertical desde la parte superior
          size: fontSize, // Tamaño de la fuente
          font: line.bold ? boldFont : font, // Fuente a utilizar
          color: rgb(0, 0, 0), // Color del texto (negro en este caso)
        });
      });
  
      // 4. Guardar el PDF generado
      const outputPath = `C:/Users/admin/Desktop/certificadosPdf/${student.lastName.toLocaleUpperCase()}-${student.firstName.toLocaleUpperCase()}-DNI-${student.identificationNumber}-CONSTANCIA-ASISTENCIA-EXAMEN.pdf`; // Ruta para guardar el PDF generado
      const pdfBytes = await pdfDoc.save();
      await fsPromises.writeFile(outputPath, pdfBytes);
  
      return outputPath;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async generateCertificateRegular(studentId: number) {
    try {
      // 1. Obtener los datos del estudiante desde la base de datos
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
        relations: ['career'],
      });
  
      if (!student) {
        return new HttpException(
          'Student does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
  
      // 2. Cargar la plantilla PDF
      const templatePath = 'C:/Users/admin/Desktop/edu-cert-repo-backEnd/src/templates/template-regular-student.pdf'; // Ruta a tu plantilla PDF
      const existingPdfBytes = await fsPromises.readFile(templatePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // 3. Modificar el PDF agregando texto adicional
      const page = pdfDoc.getPages()[0]; // Obtener la primera página del documento
  
      // Establecer una fuente estándar y una en negrita
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Fuente en negrita
  
      // Función para formatear el DNI con puntos
      function formatDNI(dni: string): string {
        // Asumiendo que dni es un string con 8 dígitos
        return dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      }
  
      // Obtener la fecha actual en formato dd/mm/yyyy
      const today = new Date();
      const formattedDNI = formatDNI(student.identificationNumber);
      const careerName = student.career.name.toLocaleUpperCase();
  
      // Función para obtener el nombre del mes a partir del número de mes
      function getMonthName(monthNumber: number): string {
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthNumber - 1];
      }
  
      // Función para dividir texto largo en líneas
      function splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
  
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      }
  
      // Dividir el texto en partes con formato
      const formattedTextParts = [
        { text: `Se deja constancia que a la fecha, ${today.getDate()} de ${getMonthName(today.getMonth() + 1)} del año ${today.getFullYear()},`, bold: false },
        { text: `${student.lastName.toLocaleUpperCase()}, ${student.firstName.toLocaleUpperCase()} D.N.I.: ${formattedDNI}`, bold: true },
        // { text: `, ${student.firstName.toLocaleUpperCase()}`, bold: true },
        // { text: ` D.N.I.: `, bold: false },
        // { text: `${formattedDNI}`, bold: true },
        { text: `es alumno/a regular del Instituto Superior del Sudeste DIEGEP Nº 6.400 de la carrera`, bold: false },
        { text: `${careerName}.`, bold: true },
        { text: `Resolución Nº 2066/18`},
        { text: `A pedido del interesado/a y para ser presentado ante quien corresponda,`, bold: false },
        { text: `se extiende la presente en la ciudad de Benito Juárez.`}
      ];
  
      // Dividir cada parte en líneas
      const maxWidth = 500; // Ajusta el valor según el ancho máximo permitido
      const fontSize = 11;
      const lines = formattedTextParts.flatMap(part => splitTextIntoLines(part.text, maxWidth, part.bold ? boldFont : font, fontSize).map(line => ({ text: line, bold: part.bold })));
  
      // Calcular posición inicial para el texto en la parte superior de la página
      const { width, height } = page.getSize();
      const startY = height - 160; // Posición vertical desde la parte superior
  
      lines.forEach((line, index) => {
        const yPosition = startY - index * 19; // Espacio entre líneas es 19 (tamaño de fuente + espacio)
        const textSize = (line.bold ? boldFont : font).widthOfTextAtSize(line.text.trim(), fontSize); // Ajusta el tamaño de la fuente aquí si es necesario
        const textX = (width - textSize) / 2; // Posición horizontal para centrar el texto
  
        page.drawText(line.text.trim(), {
          x: textX, // Posición horizontal para centrar el texto
          y: yPosition, // Posición vertical desde la parte superior
          size: fontSize, // Tamaño de la fuente
          font: line.bold ? boldFont : font, // Fuente a utilizar
          color: rgb(0, 0, 0), // Color del texto (negro en este caso)
        });
      });
  
      // 4. Guardar el PDF generado
      const outputPath = `C:/Users/admin/Desktop/certificadosPdf/${student.lastName.toLocaleUpperCase()}-${student.firstName.toLocaleUpperCase()}-DNI-${student.identificationNumber}-CONSTANCIA-ALUMNO-REGULAR.pdf`; // Ruta para guardar el PDF generado
      const pdfBytes = await pdfDoc.save();
      await fsPromises.writeFile(outputPath, pdfBytes);
  
      return outputPath;
    } catch (error) {
      return new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
