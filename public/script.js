document.addEventListener('DOMContentLoaded', function() {
    fetch('/buses')
        .then(response => response.json())
        .then(data => {
            const busTableBody = document.querySelector('#bus-table tbody');
            data.forEach(bus => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${bus.bus_no}</td>
                    <td>${bus.bus_name}</td>
                    <td>${bus.rg_no}</td>
                    <td>${bus.driver_name}</td>
                    <td>${bus.cond_name}</td>
                    <td>${bus.capacity}</td>
                `;
                busTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching bus data:', error));

        fetch('/stops')
        .then(response => response.json())
        .then(data => {
          const stopsTableBody = document.querySelector('#stops-table tbody');
          
          // Clear the table body to avoid duplicating rows
          stopsTableBody.innerHTML = '';
          
          data.forEach(stop => {
            // Create a list of stop details
            const stopsList = stop.stops.map(s => `${s.stop_name} (Cost from Origin: ${s.cost_from_origin}, Cost from Previous: ${s.cost_from_previous})`).join('<br>');
            
            // Create a new table row
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${stop.origin}</td>
              <td>${stop.destination}</td>
              <td>${stopsList}</td>
              <td>${stop.total_cost}</td>
            `;
            
            stopsTableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Error fetching stops data:', error));
      
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/queries')
        .then(response => response.json())
        .then(data => {
            const queriesTableBody = document.querySelector('#queries-table tbody');
            data.forEach(query => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${query.name}</td>
                    <td>${query.email}</td>
                    <td>${query.message}</td>
                    <td>${query.phone}</td>
                `;
                queriesTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching queries data:', error));
});

// document.getElementById('submit-stop').addEventListener('click', function(event) {
//     event.preventDefault(); // Prevent the default form submission

//     const form = document.getElementById('stops-form');
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     // Convert stops to an array of objects
//     data.stops = [];
//     for (let i = 0; i < stopIndex; i++) {
//         if (formData.get(`stops[${i}][name]`)) {
//             data.stops.push({
//                 name: formData.get(`stops[${i}][name]`),
//                 costFromOrigin: formData.get(`stops[${i}][costFromOrigin]`),
//                 costFromPreviousStop: formData.get(`stops[${i}][costFromPreviousStop]`)
//             });
//         }
//     }

//     fetch('/stop', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         alert('Stops added successfully!');
//         form.reset();
//         toggleStopsForm();
//     })
//     .catch(error => console.error('Error:', error));
// });