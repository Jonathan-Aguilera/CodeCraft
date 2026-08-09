import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

async function seedDatabase() {
  console.log('🌱 Iniciando siembra de datos de prueba con IDs automáticas...');

  try {
    // 1. USERS (4 usuarios con IDs automáticos)
    const users = [
      {
        email: 'developer@example.com',
        displayName: 'Carlos Dev',
        role: 'developer',
        createdAt: Timestamp.now(),
      },
      {
        email: 'client@example.com',
        displayName: 'María Cliente',
        role: 'client',
        createdAt: Timestamp.now(),
      },
      {
        email: 'both@example.com',
        displayName: 'Laura Both',
        role: 'both',
        createdAt: Timestamp.now(),
      },
      {
        email: 'admin@example.com',
        displayName: 'Admin User',
        role: 'admin',
        createdAt: Timestamp.now(),
      },
    ];

    const userIds: string[] = [];
    for (const user of users) {
      const docRef = await db.collection('users').add(user);
      userIds.push(docRef.id);
      console.log(`✅ Usuario creado: ${user.displayName} (ID: ${docRef.id})`);
    }

    // Guardar los IDs de los usuarios relevantes
    const [devUid, clientUid, bothUid, adminUid] = userIds;

    // 2. DEVELOPER PROFILES (solo para el developer y el "both")
    const developerProfiles = [
      {
        uid: devUid, // referencia al usuario developer
        title: 'Frontend Developer con React',
        bio: 'Especialista en interfaces de usuario y experiencia de usuario.',
        skills: ['React', 'TypeScript', 'Tailwind', 'Vue'],
        experienceYears: 3,
        hourlyRate: 25,
        availability: 'available',
        totalCompletedProjects: 2,
        averageRating: 2.0,
        socialLinks: {
          github: 'https://github.com/carlosdev',
          linkedin: 'https://linkedin.com/in/carlosdev',
        },
      },
      {
        uid: bothUid, // referencia al usuario "both"
        title: 'Fullstack Developer especializado en Node.js',
        bio: 'Experiencia en backends escalables y arquitecturas cloud.',
        skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
        experienceYears: 5,
        hourlyRate: 40,
        availability: 'available',
        totalCompletedProjects: 8,
        averageRating: 4.9,
        socialLinks: {
          github: 'https://github.com/lauraboth',
          linkedin: 'https://linkedin.com/in/lauraboth',
          portfolio: 'https://lauraboth.dev',
        },
      },
    ];

    for (const profile of developerProfiles) {
      // Usamos el mismo ID que el usuario para mantener la relación 1:1
      await db.collection('developerProfiles').doc(profile.uid).set(profile);
      console.log(`✅ Perfil de desarrollador creado para UID: ${profile.uid}`);
    }

    // 3. PROJECTS (1 proyecto con ID automático)
    const projectData = {
      clientUid: clientUid,
      clientName: 'María Cliente',
      title: 'Desarrollo de App de E-commerce',
      description: 'Necesito una tienda online completa con carrito de compras, pasarela de pago y panel de administración.',
      requiredSkills: ['React', 'Node.js', 'Stripe'],
      budgetMin: 5000,
      budgetMax: 8000,
      paymentType: 'fixed',
      maxDevelopersNeeded: 2,
      currentApplicantsCount: 0, // se actualizará al crear aplicaciones
      status: 'open',
      createdAt: Timestamp.now(),
      recommendedRoles: ['1 Frontend React', '1 Backend Node'],
    };

    const projectRef = await db.collection('projects').add(projectData);
    const projectId = projectRef.id;
    console.log(`✅ Proyecto creado: ${projectData.title} (ID: ${projectId})`);

    // 4. APPLICATIONS (2 postulaciones: una del developer y una del both)
    const applications = [
      {
        projectId: projectId,
        developerUid: devUid,
        developerName: 'Carlos Dev',
        proposedRate: 25,
        coverLetter: 'Hola, soy Carlos y me encantaría trabajar en tu proyecto. Tengo experiencia con React y puedo empezar de inmediato.',
        answers: ['Sí, tengo experiencia con React', 'Sí, puedo trabajar a tiempo completo'],
        status: 'rejected',
        appliedAt: Timestamp.now(),
      },
      {
        projectId: projectId,
        developerUid: bothUid,
        developerName: 'Laura Both',
        proposedRate: 40,
        coverLetter: 'Hola, soy Laura. Ofrezco una solución integral con Node.js en el backend y React en el frontend.',
        answers: ['Sí, tengo experiencia en ambos', 'Puedo comenzar en 5 días'],
        status: 'pending',
        appliedAt: Timestamp.now(),
      },
    ];

    for (const app of applications) {
      const docRef = await db.collection('applications').add(app);
      console.log(`✅ Aplicación creada para proyecto ${app.projectId} por ${app.developerName} (ID: ${docRef.id})`);
    }

    // Actualizar el contador de aplicaciones en el proyecto
    await db.collection('projects').doc(projectId).update({
      currentApplicantsCount: applications.length,
    });
    console.log(`✅ Contador de aplicaciones actualizado a ${applications.length}`);

    // 5. REVIEWS (2 reseñas: una negativa para el developer, una positiva para el both)
    const reviews = [
      {
        projectId: projectId,
        developerUid: devUid,
        clientUid: clientUid,
        rating: 1,
        comment: 'Carlos no cumplió con los plazos acordados, el código tenía muchos bugs y abandonó el proyecto a mitad de camino. No lo recomiendo.',
        createdAt: Timestamp.now(),
      },
      {
        projectId: projectId,
        developerUid: bothUid,
        clientUid: clientUid,
        rating: 5,
        comment: 'Laura fue excelente, entregó el proyecto antes de tiempo, código impecable y siempre disponible para consultas. ¡La recomiendo ampliamente!',
        createdAt: Timestamp.now(),
      },
    ];

    for (const review of reviews) {
      const docRef = await db.collection('reviews').add(review);
      console.log(`✅ Reseña creada para developer ${review.developerUid} (ID: ${docRef.id})`);
    }

    console.log('🎉 ¡Datos de prueba insertados exitosamente con IDs automáticas!');
    console.log('📊 IDs generados:');
    console.log(`  - Developer ID: ${devUid}`);
    console.log(`  - Client ID: ${clientUid}`);
    console.log(`  - Both ID: ${bothUid}`);
    console.log(`  - Admin ID: ${adminUid}`);
    console.log(`  - Project ID: ${projectId}`);
  } catch (error) {
    console.error('❌ Error durante la siembra:', error);
  }
}

seedDatabase();