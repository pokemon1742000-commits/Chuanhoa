using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace LicenseGenerator
{
    internal static class Program
    {
        private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        private static readonly Regex LicenseRegex = new Regex("[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}", RegexOptions.Compiled);

        private static int Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("Inventory Compare - License Generator");
            Console.WriteLine("-------------------------------------");

            int count = ReadCount(args);
            List<string> outputPaths = GetLicenseFilePaths();
            HashSet<string> uniqueLicenses = new HashSet<string>();

            foreach (string outputPath in outputPaths)
            {
                foreach (string license in ReadExistingLicenses(outputPath))
                {
                    uniqueLicenses.Add(license);
                }
            }

            List<string> createdLicenses = new List<string>();
            while (createdLicenses.Count < count)
            {
                string license = CreateLicense();
                if (uniqueLicenses.Add(license))
                {
                    createdLicenses.Add(license);
                }
            }

            List<string> sortedLicenses = uniqueLicenses.OrderBy(value => value).ToList();
            List<string> updatedPaths = new List<string>();
            List<string> failedPaths = new List<string>();

            foreach (string outputPath in outputPaths)
            {
                try
                {
                    WriteLicenseFile(outputPath, sortedLicenses);
                    File.SetAttributes(outputPath, File.GetAttributes(outputPath) | FileAttributes.Hidden);
                    updatedPaths.Add(outputPath);
                }
                catch (Exception error)
                {
                    failedPaths.Add(outputPath + " - " + error.Message);
                }
            }

            Console.WriteLine();
            Console.WriteLine("New licenses:");
            foreach (string license in createdLicenses)
            {
                Console.WriteLine(license);
            }

            Console.WriteLine();
            Console.WriteLine("Updated hidden license files:");
            foreach (string updatedPath in updatedPaths)
            {
                Console.WriteLine(updatedPath);
            }

            if (failedPaths.Count > 0)
            {
                Console.WriteLine();
                Console.WriteLine("Could not update:");
                foreach (string failedPath in failedPaths)
                {
                    Console.WriteLine(failedPath);
                }
            }

            Console.WriteLine();
            Console.WriteLine("Press any key to close.");
            Console.ReadKey(true);
            return 0;
        }

        private static List<string> GetLicenseFilePaths()
        {
            List<string> paths = new List<string>();
            paths.Add(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "licenses.json"));

            string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            if (!string.IsNullOrWhiteSpace(appData))
            {
                paths.Add(Path.Combine(appData, "Inventory Compare", "licenses.json"));
            }

            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            if (!string.IsNullOrWhiteSpace(localAppData))
            {
                paths.Add(Path.Combine(localAppData, "Inventory Compare", "licenses.json"));
            }

            return paths
                .Where(pathValue => !string.IsNullOrWhiteSpace(pathValue))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        private static int ReadCount(string[] args)
        {
            int argCount;
            if (args.Length > 0 && int.TryParse(args[0], out argCount) && argCount > 0)
            {
                return argCount;
            }

            Console.Write("Number of licenses to create: ");
            string input = Console.ReadLine();
            int count;
            if (int.TryParse(input, out count) && count > 0)
            {
                return count;
            }

            return 1;
        }

        private static List<string> ReadExistingLicenses(string filePath)
        {
            if (!File.Exists(filePath))
            {
                return new List<string>();
            }

            string content = File.ReadAllText(filePath).ToUpperInvariant();
            return LicenseRegex.Matches(content)
                .Cast<Match>()
                .Select(match => match.Value)
                .Distinct()
                .ToList();
        }

        private static void WriteLicenseFile(string filePath, List<string> licenses)
        {
            string directory = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            string json = "{\r\n  \"licenses\": [\r\n" +
                string.Join(",\r\n", licenses.Select(license => "    \"" + license + "\"")) +
                "\r\n  ]\r\n}\r\n";
            File.WriteAllText(filePath, json);
        }

        private static string CreateLicense()
        {
            return CreateSegment(3) + "-" + CreateSegment(3) + "-" + CreateSegment(3) + "-" + CreateSegment(4);
        }

        private static string CreateSegment(int length)
        {
            char[] chars = new char[length];
            byte[] bytes = new byte[length];
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }

            for (int index = 0; index < length; index++)
            {
                chars[index] = Alphabet[bytes[index] % Alphabet.Length];
            }

            return new string(chars);
        }
    }
}
