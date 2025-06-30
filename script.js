document.addEventListener('DOMContentLoaded', () => {
// Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });

    // PDF Download functionality
    document.getElementById('download-resume-btn').addEventListener('click', () => {
        const element = document.querySelector('.container');
        const opt = {
            margin:       0.2,
            filename:     'Resume_KunjKachhiya.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 4 },
            jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: 'avoid-all' }
        };
        html2pdf().set(opt).from(element).save();
    });


    // Enhanced hover effect for skills
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.addEventListener('mouseover', () => {
            skill.style.transform = 'translateY(-5px)';
            skill.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });

        skill.addEventListener('mouseout', () => {
            skill.style.transform = 'translateY(0)';
            skill.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Skill progress bar generation
    document.querySelectorAll('.skill').forEach((skill, index) => {
        const percentage = parseInt(skill.dataset.percentage);
        const svg = skill.querySelector('.progress-graph');
        const percentageSpan = skill.querySelector('.percentage');

        // Clear previous SVG content to ensure animation replays correctly on refresh
        svg.innerHTML = '';

        // Define gradient for the polyline stroke dynamically for each SVG
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        const gradientId = `lineGradient-${index}`; // Unique ID for each gradient
        linearGradient.setAttribute('id', gradientId);
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#3498db'); // Start color
        linearGradient.appendChild(stop1);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#2ecc71'); // End color
        linearGradient.appendChild(stop2);

        defs.appendChild(linearGradient);
        svg.appendChild(defs);

        // Generate points for a straight line graph based on the percentage
        // The graph will go from 0% to the skill's percentage
        const generateWavyPoints = (percentage) => {
            const points = [];
            const numSegments = 10; // Number of segments for the wavy line
            const amplitude = 5 * (percentage / 100); // Amplitude of the wave, proportional to percentage
            const startY = 10; // Adjusted startY to center the line vertically

            for (let i = 0; i <= numSegments; i++) {
                const x = (i / numSegments) * 100;
                let y = startY;

                if (i > 0 && i < numSegments) { // Apply wave to intermediate points
                    y = startY + amplitude * Math.sin((i / numSegments) * Math.PI * 2); // Sine wave
                }

                // Ensure the line ends at the correct percentage height
                if (i === numSegments) {
                    y = 10 - (percentage / 100) * 5; // Adjusted endY to center the line vertically
                }
                points.push(`${x},${y}`);
            }
            return points.join(' ');
        };

        const points = generateWavyPoints(percentage);

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', `url(#${gradientId})`); // Use the unique gradient ID
        polyline.setAttribute('stroke-width', '20'); // Increased stroke width for better visibility

        svg.appendChild(polyline);

        // Animate polyline drawing using clip-path
        const clipPathId = `clipPath-${index}`;
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', clipPathId);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', '0');
        rect.setAttribute('width', '0'); // Start with 0 width
        rect.setAttribute('height', '20'); // Height of the SVG viewbox
        clipPath.appendChild(rect);
        defs.appendChild(clipPath);
        polyline.setAttribute('clip-path', `url(#${clipPathId})`);

        // Animate the width of the rectangle to reveal the polyline
        setTimeout(() => {
            rect.setAttribute('width', percentage); // Animate to percentage width
            rect.style.transition = 'width 4s ease-out';
        }, 500);

        // Display percentage text directly
        percentageSpan.textContent = `${percentage}%`;
        percentageSpan.style.animation = 'popIn 0.5s ease-out forwards'; // Apply popIn animation
        

        // Start animation after a short delay
        setTimeout(() => {
            requestAnimationFrame(animatePercentage);
        }, 500); // Delay to allow other elements to load
    });
});