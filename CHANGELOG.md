# Changelog

All notable changes to the Postman Updater project will be documented in this file.

## [1.1.3] - 2025-12-15

### 🐛 Bug Fixes

- **Updated openapi-to-postmanv2 Package**
  - Upgraded from v4.25.0 to v5.6.0
  - Fixes "Cannot read properties of undefined (reading 'parseSpec')" error
  - Improved compatibility with OpenAPI 3.0 specs
  - Better error handling and validation

### 🔄 Changes

- Added validation step before conversion
- Enhanced error messages for troubleshooting
- Better null checking in conversion service

---

## [1.1.2] - 2025-12-15

### 🐛 Bug Fixes

- **Fixed Converter parseSpec Error**
  - Resolved "Cannot read properties of undefined (reading 'parseSpec')" error
  - Now uses raw spec for both hashing AND conversion
  - Converter requires original spec format, not dereferenced version
  - Ensures proper conversion to Postman format

### 🔧 Technical Changes

- Added `getRawSpec()` method to SwaggerService
- Updated conversion to use raw spec instead of dereferenced spec
- Maintains validation for safety while using original format for conversion

---

## [1.1.1] - 2025-12-15

### 🐛 Bug Fixes

- **Fixed Circular Reference Error**
  - Resolved "Converting circular structure to JSON" error when hashing Swagger specs
  - Now uses raw spec (before dereferencing) for hash generation
  - Added fallback stringifier for handling circular references
  - Ensures compatibility with complex Swagger/OpenAPI specs that have circular dependencies

### 🔧 Technical Changes

- Store raw Swagger spec before validation for hashing purposes
- Implement custom JSON stringifier with circular reference detection
- Use WeakSet to track visited objects and prevent infinite loops

---

## [1.1.0] - 2025-12-15

### ✨ New Features

- **Collection Selection Menu**
  - Automatically fetches and displays all existing Postman collections
  - Interactive list to select from existing collections or create new
  - Shows collection names and IDs for easy identification
  - Eliminates need to manually find and copy collection IDs
  - Validates API key before showing collections

### 🔄 Changes

- Removed manual collection ID input field
- API key validation now happens during configuration (not after)
- Improved user experience with visual collection picker

### 📚 Documentation Updates

- Updated all documentation files with new collection selection flow
- Added new examples showing collection selection
- Updated quick start guide with new workflow

---

## [1.0.0] - 2025-12-15

### 🎉 Initial Release

#### ✨ Features

- **Interactive CLI Interface**
  - User-friendly prompts for configuration
  - Password masking for API keys
  - Configuration persistence and reuse
  - Beautiful colored output with status indicators

- **Swagger/OpenAPI Support**
  - Fetch specs from any public URL
  - Validate OpenAPI 2.0, 3.0, and 3.1 formats
  - Automatic spec dereferencing
  - Error handling for invalid specs

- **Smart Change Detection**
  - SHA-256 hash-based comparison
  - Efficient caching system
  - Only updates when changes detected
  - Timestamp tracking

- **Postman Integration**
  - Create new collections automatically
  - Update existing collections
  - Validate API keys
  - List and retrieve collections
  - Full Postman API v1 support

- **Two Operation Modes**
  - **Sync Once**: Manual one-time update
  - **Watch Mode**: Continuous monitoring with configurable intervals

- **Format Conversion**
  - OpenAPI to Postman Collection v2.1
  - Organized by tags
  - Includes request examples
  - Parameter resolution
  - Optimized conversion

#### 🏗️ Architecture

- **Modular Service Layer**
  - `SwaggerService`: API spec operations
  - `PostmanService`: Postman API interactions
  - `ConverterService`: Format conversion

- **Utility Layer**
  - `Logger`: Colored console output
  - `ConfigManager`: Configuration persistence
  - `CacheManager`: Change detection cache

- **Type Safety**
  - Full TypeScript implementation
  - Custom type definitions
  - Type declarations for dependencies

#### 📚 Documentation

- **GET_STARTED.md**: 3-minute quick start guide
- **QUICKSTART.md**: Detailed getting started
- **README.md**: Complete documentation
- **EXAMPLES.md**: Real-world usage examples
- **ARCHITECTURE.md**: Technical architecture details
- **PROJECT_SUMMARY.md**: Project overview
- **CHANGELOG.md**: This file

#### 🔧 Configuration

- JSON-based configuration storage
- Environment variable support
- Configurable poll intervals
- Optional collection ID specification

#### 🛡️ Security

- Local API key storage
- Gitignored sensitive files
- HTTPS-only connections
- Password input masking

#### 📦 Dependencies

**Production:**
- axios ^1.6.2
- dotenv ^16.3.1
- inquirer ^9.2.12
- openapi-to-postmanv2 ^4.19.0
- swagger-parser ^10.0.3
- chalk ^4.1.2

**Development:**
- typescript ^5.3.3
- ts-node ^10.9.2
- @types/node ^20.10.5
- @types/inquirer ^9.0.7

#### 🚀 Build & Deploy

- TypeScript compilation to ES2020
- Source maps generation
- Declaration files
- Yarn package manager
- Development and production modes

#### ✅ Quality

- Zero linting errors
- Type-safe implementation
- Error handling throughout
- Graceful shutdown handling

#### 📝 Project Structure

```
postman_updater/
├── src/
│   ├── index.ts
│   ├── services/
│   │   ├── swaggerService.ts
│   │   ├── postmanService.ts
│   │   └── converterService.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── config.ts
│   └── types/
│       ├── index.ts
│       └── openapi-to-postmanv2.d.ts
├── dist/ (generated)
├── Documentation files
└── Configuration files
```

#### 🎯 Use Cases

- Development teams syncing API specs
- CI/CD pipeline integration
- Automated documentation updates
- API version management
- Multi-environment API testing

#### 🔄 Workflow

1. User provides Swagger URL and Postman API key
2. Tool validates credentials
3. Fetches and validates Swagger spec
4. Generates hash for change detection
5. Converts to Postman format if changed
6. Creates or updates Postman collection
7. Saves configuration for future runs

#### 🌟 Highlights

- **Zero Configuration**: Works out of the box
- **Smart Updates**: Only syncs when needed
- **User Friendly**: Clear prompts and feedback
- **Production Ready**: Compiled, tested, documented
- **Extensible**: Modular architecture for easy enhancement

---

## Future Roadmap

### Planned Features

- [ ] Webhook support for push-based updates
- [ ] Diff reports showing what changed
- [ ] Multiple collection sync
- [ ] Email/Slack notifications
- [ ] Docker containerization
- [ ] Web UI interface
- [ ] Rollback capability
- [ ] Dry run mode
- [ ] Batch operations
- [ ] Custom conversion templates

### Potential Improvements

- [ ] Unit test suite
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] Metrics and monitoring
- [ ] Plugin system
- [ ] GraphQL support
- [ ] Custom authentication methods
- [ ] Workspace management
- [ ] Team collaboration features

---

## Version History

### [1.1.3] - 2025-12-15
- Upgraded openapi-to-postmanv2 to v5.6.0
- Fixed parseSpec error completely
- Added validation before conversion

### [1.1.2] - 2025-12-15
- Fixed converter parseSpec error
- Use raw spec for conversion to Postman format

### [1.1.1] - 2025-12-15
- Fixed circular reference error in hash generation
- Improved compatibility with complex Swagger specs

### [1.1.0] - 2025-12-15
- Added interactive collection selection menu
- Improved configuration workflow
- Updated documentation

### [1.0.0] - 2025-12-15
- Initial release with core functionality
- Complete documentation
- Production-ready build

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

```bash
git clone <repository>
cd postman_updater
yarn install
yarn build
```

### Making Changes

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

---

## License

MIT License - See LICENSE file for details

---

## Credits

**Created by:** Postman Updater Team  
**Date:** December 15, 2025  
**Version:** 1.1.3  
**Status:** Production Ready ✅

---

## Support

For issues, questions, or contributions:
- Check documentation files
- Review examples
- Open an issue
- Submit a pull request

---

**Last Updated:** December 15, 2025

