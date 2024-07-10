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

  async generateCertificate(studentId: number, examId:number) {
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
        where: {present:true, student:{id:studentId}, exam:{id:examId}},relations:['exam', 'exam.subject']
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

      // Establecer una fuente estándar
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Función para formatear el DNI con puntos
      function formatDNI(dni: string): string {
        // Asumiendo que dni es un string con 8 dígitos
        return dni.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      }

      // Obtener la fecha actual en formato dd/mm/yyyy
      const today = new Date();
      const formattedDate = `${assistanceExam.exam.date.getDate()}/${assistanceExam.exam.date.getMonth() + 1}/${assistanceExam.exam.date.getFullYear()}`;
      const formattedDNI = formatDNI(student.identificationNumber);
      // Texto con datos variables
      const additionalText = `Por la presente, se deja constancia que ${student.lastName.toLocaleUpperCase()} ${student.firstName.toLocaleUpperCase()} D.N.I ${formattedDNI}
    Ha asistido el ${formattedDate} a la mesa examinadora ${assistanceExam.exam.subject.name}
    A pedido del interesado/a y para presentar ante quien corresponda,
    se extiende la presente en la ciudad de Benito Juárez a los ${today.getDate()} días del mes de ${getMonthName(today.getMonth() + 1)} de ${today.getFullYear()}.`;

      // Función para obtener el nombre del mes a partir del número de mes
      function getMonthName(monthNumber: number): string {
        const months = [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ];
        return months[monthNumber - 1];
      }

      // Dividir el texto en líneas
      const lines = additionalText.split('\n');
      // Calcular posición inicial para el texto en la parte superior de la página
      const { width, height } = page.getSize();
      const startY = height - 184; // Posición vertical desde la parte superior

      lines.forEach((line, index) => {
        const yPosition = startY - index * 19; // Espacio entre líneas es 19 (tamaño de fuente + espacio)

        // Calcular el ancho del texto actual
        const textSize = font.widthOfTextAtSize(line.trim(), 11); // Ajusta el tamaño de la fuente aquí si es necesario

        // Calcular posición horizontal para centrar el texto
        const textX = (width - textSize) / 2;

        page.drawText(line.trim(), {
          x: textX, // Posición horizontal para centrar el texto
          y: yPosition, // Posición vertical desde la parte superior
          size: 11, // Tamaño de la fuente
          font, // Fuente a utilizar
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
}
