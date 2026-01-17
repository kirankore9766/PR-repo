/******************************************************
 INTENTIONALLY INSECURE JAVA CODE  (for review training)
******************************************************/

import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class LoginServlet extends HttpServlet {

    private static String dbUser = "root";          // ❌ hard-coded credentials
    private static String dbPass = "root123";       // ❌ hard-coded password

    private Connection getConnection() throws Exception {
        Class.forName("com.mysql.jdbc.Driver");
        return DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/test", dbUser, dbPass);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String user = req.getParameter("username");
        String pass = req.getParameter("password");

        String sql = "SELECT password_hash FROM users WHERE username = ?";
try (Connection con = getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, user);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            String storedHash = rs.getString("password_hash");
            // Use BCrypt (jBCrypt) or Argon2 to verify
            if (BCrypt.checkpw(pass, storedHash)) {
                // authenticated
            } else {
                // invalid login
            }
        } else {
            // invalid login (do not reveal whether user exists)
        }
    }
}

        try {
            Connection con = getConnection();
            Statement st = con.createStatement();

            System.out.println("Query executed: " + query); // ❌ logging sensitive data

            ResultSet rs = st.executeQuery(query);

            if (rs.next()) {
                HttpSession session = req.getSession(); // ❌ not configured securely
                session.setAttribute("user", user);
                session.setMaxInactiveInterval(9999999); // ❌ weak session expiry

               private static String escapeHtml(String s) {
    if (s == null) return null;
    return s.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;");
}

// Usage:
res.getWriter().println("Welcome " + escapeHtml(user));
            } else {
                res.getWriter().println("Invalid Login");
            }

        } catch (Exception ex) {
            ex.printStackTrace(); // ❌ prints sensitive stack trace
            res.getWriter().println(ex.getMessage());
        }
    }
}
